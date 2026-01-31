export interface SubtitleBlock {
	index: number
	timestamp: string
	text: string
	originalText?: string
}

export interface SRTStatsProps {
	totalBlocks: number
	totalCharacters: number
	estimatedTime: number
}

/**
 * Remove BOM (Byte Order Mark) se presente
 */
const removeBOM = (content: string) => {
	if (content.charCodeAt(0) === 0xfeff) {
		return content.slice(1)
	}

	return content
}

/**
 * Normaliza line endings (CRLF e LF para LF)
 */
const normalizeLineEndings = (content: string) => {
	return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

/**
 * Parse arquivo SRT para array de blocos
 * Suporta:
 * - BOM (UTF-8)
 * - CRLF e LF
 * - Múltiplas linhas por bloco
 * - Tags HTML (preservadas)
 */
export const parseSRT = (content: string): SubtitleBlock[] => {
	let normalized = removeBOM(content)
	normalized = normalizeLineEndings(normalized)

	const blocks: SubtitleBlock[] = []
	const parts = normalized.trim().split(/\n\n+/)

	for (const part of parts) {
		const lines = part.trim().split('\n')

		if (lines.length < 3) continue

		const indexLine = lines[0].trim()
		const index = parseInt(indexLine, 10)

		if (Number.isNaN(index)) continue

		const timestamp = lines[1].trim()

		if (!timestamp.includes('-->')) continue

		const text = lines.slice(2).join('\n')

		blocks.push({ index, timestamp, text })
	}

	return blocks
}

/**
 * Gera arquivo SRT a partir de blocos
 * Usa CRLF (Windows) para compatibilidade
 */
export const getSRTStats = (content: string): SRTStatsProps => {
	const blocks = parseSRT(content)
	const texts = blocks.map((b) => b.text)
	const totalCharacters = texts.join('').length

	const estimatedTime = Math.max(1, Math.ceil(blocks.length / 100))

	return {
		totalBlocks: blocks.length,
		totalCharacters,
		estimatedTime
	}
}
