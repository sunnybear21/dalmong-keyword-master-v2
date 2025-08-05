
import type { SeoAnalysisResult, NicheKeyword } from '../types.ts';

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function exportAsJson(data: SeoAnalysisResult, filename: string) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    triggerDownload(blob, `${filename}.json`);
}

function convertNicheKeywordsToCsv(nicheKeywords: NicheKeyword[]): string {
    const headers = ['keyword', 'searchVolume', 'competitionScore', 'reason'];
    const headerString = headers.join(',');
    
    const rows = nicheKeywords.map(row => {
        const values = headers.map(header => {
            const value = row[header as keyof NicheKeyword];
            // Escape commas and quotes in the reason field
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        return values.join(',');
    });
    
    return [headerString, ...rows].join('\n');
}


export function exportAsCsv(data: SeoAnalysisResult, filename: string) {
    const csvString = convertNicheKeywordsToCsv(data.nicheKeywords);
    const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
    triggerDownload(blob, `${filename}_niche_keywords.csv`);
}

export function exportAsTxt(title: string, content: string, filename: string) {
    const textContent = `제목: ${title}\n\n---\n\n${content}`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    triggerDownload(blob, `${filename}.txt`);
}
