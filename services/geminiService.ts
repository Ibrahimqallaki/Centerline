import { GoogleGenAI } from "@google/genai";
import { MachinePoint } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSOPContent = async (point: MachinePoint): Promise<string> => {
  const modelId = 'gemini-3-flash-preview';
  
  const prompt = `
    Jag behöver en kort, tydlig och instruerande text (SOP) för en maskinoperatör som arbetar med en Trågpackare (Tray Packer).
    
    Punktinformation:
    - Namn: ${point.name}
    - Zon: ${point.zone}
    - Målvärde (Centerline): ${point.targetValue}
    - Tolerans: ${point.tolerance}
    - Mätmetod: ${point.measureMethod}
    - Kritikalitet: ${point.criticality}
    - Beskrivning: ${point.description}
    ${point.phaseAngle ? `- Fasvinkel: ${point.phaseAngle} grader i 360-cykeln.` : ''}

    Uppgift:
    Skapa en lista med 3-4 punkter för operatören:
    1. Hur man kontrollerar värdet.
    2. Vad risken är om värdet är fel (särskilt fokus på krasch om kritikaliteten är hög).
    3. Hur man justerar det säkert.
    
    Håll tonen professionell, direkt och säkerhetsfokuserad. Svara på svenska. Använd Markdown för formatering.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Kunde inte generera SOP. Kontrollera anslutningen.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ett fel uppstod vid generering av instruktionen. Vänligen försök igen senare.";
  }
};
