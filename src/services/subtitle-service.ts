import type { LanguageCode } from '../config/languages'
import { parseSRT, type SubtitleBlock } from '../utils/subtitle-parser'
import { TranslationService } from './translation-service'

export class SubtitleService {
	private translationService = TranslationService.getInstance()

	constructor() {
		this.translationService = TranslationService.getInstance()
	}

	/**
	 * Traduz um arquivo de legenda completo
	 * Usa tradução em lote para maior eficiência
	 */

	async translateSubtitle(
		srtContent: string,
		sourceLang: LanguageCode,
		targetLang: LanguageCode
	): Promise<SubtitleBlock[]> {
		console.log('\n' + '='.repeat(60))
		console.log('🎬 INICIANDO TRADUÇÃO DE LEGENDA')
		console.log('='.repeat(60))

		const startTime = Date.now()

		// Parse do arquivo
		console.log('📄 Analisando arquivo...')
		const blocks = parseSRT(srtContent)
		console.log(`  ✓ ${blocks.length} blocos encontrados`)

		// Extrair apenas os textos
		const texts = blocks.map((block) => block.text)
		const totalChars = texts.join('').length
		console.log(`  ✓ ${totalChars} caracteres para traduzir\n`)

		// Traduzir em lote (muito mais rápido!)
		console.log('🔄 Traduzindo...')
		const translations = await this.translationService.translateBatch(
			texts,
			sourceLang,
			targetLang
		)

		// Reconstruir blocos com traduções
		const translatedBlocks: SubtitleBlock[] = blocks.map((block, index) => ({
			...block,
			text: translations[index],
			originalText: block.text
		}))

		const duration = ((Date.now() - startTime) / 1000).toFixed(2)

		console.log('')
		console.log('='.repeat(60))
		console.log('✅ TRADUÇÃO CONCLUÍDA')
		console.log(`⏱️  Tempo: ${duration}s`)
		console.log(
			`📊 Velocidade: ${(blocks.length / parseFloat(duration)).toFixed(0)} linhas/s`
		)
		console.log(`💰 Caracteres usados: ${totalChars}`)
		console.log('='.repeat(60) + '\n')

		return translatedBlocks
	}
}
