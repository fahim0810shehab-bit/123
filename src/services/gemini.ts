export type AnalysisLevel = 1 | 2 | 3;

export interface AnalysisResult {
  text: string;
  level: AnalysisLevel;
}

export async function analyzeTranscripts(
  files: File[], 
  level: AnalysisLevel, 
  program?: string
): Promise<{ text: string, data: any }> {
  try {
    if (files.length === 0) {
      throw new Error("Please upload a valid transcript file.");
    }

    const file = files[0]; // Process the first file

    const formData = new FormData();
    formData.append('file', file);
    formData.append('level', level.toString());
    if (program) {
      formData.append('program', program);
    }

    // Send raw file to the server for analysis
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to analyze transcripts");
    }

    const data = await response.json();
    return {
      text: data.text || "No response generated.",
      data: data.data || null
    };
  } catch (error: unknown) {
    console.error("Error analyzing transcripts:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during analysis.");
  }
}
