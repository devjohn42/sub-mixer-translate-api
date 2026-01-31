import type { LanguageCode } from 'deepl-node'
import * as deepl from 'deepl-node'
import { env } from '../env'

// type LanguageCodeType = deepl.TargetLanguageCode | deepl.SourceLanguageCode

export class TranslationService {
	private static instance: TranslationService
	private translator: deepl.Translator

	private constructor() {
		const apiKey = env.DEEPL_API_KEY

		if (!apiKey) {
			throw new Error('DEEPL_API_KEY não configurada')
		}

		this.translator = new deepl.Translator(apiKey)
	}

	static getInstance(): TranslationService {
		if (!TranslationService.instance) {
			TranslationService.instance = new TranslationService()
		}

		return TranslationService.instance
	}

	/**
	 * Mapeia códigos de idioma para formato DeepL
	 */
	private mapSourceLanguageCode(code: LanguageCode): deepl.SourceLanguageCode | null {
		const map: Partial<Record<LanguageCode, deepl.SourceLanguageCode>> = {
			pt: 'pt',
			en: 'en',
			ja: 'ja'
		}
		return map[code] ?? null
	}

	private mapTargetLanguageCode(code: LanguageCode): deepl.TargetLanguageCode {
		const map: Partial<Record<LanguageCode, deepl.SourceLanguageCode>> = {
			pt: 'pt',
			en: 'en',
			ja: 'ja'
		}
		return map[code] as any
	}

	/**
	 * Traduz um texto simples
	 */
	async translateText(
		text: string,
		sourceLang: LanguageCode,
		targetLang: LanguageCode
	): Promise<string> {
		if (!text || text.trim() === '') {
			return text
		}

		try {
			const result = await this.translator.translateText(
				text,
				this.mapSourceLanguageCode(sourceLang),
				this.mapTargetLanguageCode(targetLang),
				{
					preserveFormatting: true, // Preserva quebras de linha
					tagHandling: 'html' // Preserva tags HTML como <i>
				}
			)

			return result.text
		} catch (error) {
			console.error('❌ Erro na tradução:', error)
			throw new Error('Falha ao traduzir texto')
		}
	}

	/**
	 * Traduz múltiplos textos em lote
	 * DeepL aceita até 50 textos por requisição
	 */
	async translateBatch(
		texts: string[],
		sourceLang: LanguageCode,
		targetLang: LanguageCode
	): Promise<string[]> {
		if (texts.length === 0) {
			return []
		}

		// Filtrar textos vazios mas manter índices
		const nonEmptyIndices: number[] = []
		const nonEmptyTexts: string[] = []

		texts.forEach((text, index) => {
			if (text && text.trim() !== '') {
				nonEmptyIndices.push(index)
				nonEmptyTexts.push(text)
			}
		})

		if (nonEmptyTexts.length === 0) {
			return texts
		}

		try {
			// DeepL permite até 50 textos por request
			const BATCH_SIZE = 50
			const allTranslations: string[] = []

			for (let i = 0; i < nonEmptyTexts.length; i += BATCH_SIZE) {
				const batch = nonEmptyTexts.slice(i, i + BATCH_SIZE)

				const results = await this.translator.translateText(
					batch,
					this.mapSourceLanguageCode(sourceLang),
					this.mapTargetLanguageCode(targetLang),
					{
						preserveFormatting: true,
						tagHandling: 'html'
					}
				)

				// Extrair textos traduzidos
				const translations = Array.isArray(results)
					? results.map((r) => r.text)
					: [results]

				allTranslations.push(...translations)
			}

			// Reconstruir array com textos vazios nos índices originais
			const result = [...texts]
			nonEmptyIndices.forEach((originalIndex, translatedIndex) => {
				result[originalIndex] = allTranslations[translatedIndex]
			})

			return result
		} catch (error) {
			console.error('❌ Erro na tradução em lote:', error)
			throw new Error('Falha ao traduzir textos em lote')
		}
	}

	/**
	 * Verifica uso da API (caracteres restantes)
	 */
	async getUsage(): Promise<{ used: number; limit: number; remaining: number }> {
		try {
			const usage = await this.translator.getUsage()

			if (usage.character) {
				return {
					used: usage.character.count,
					limit: usage.character.limit,
					remaining: usage.character.limit - usage.character.count
				}
			}

			throw new Error('Informação de uso não disponível')
		} catch (error) {
			console.error('❌ Erro ao obter uso:', error)
			throw error
		}
	}
}
