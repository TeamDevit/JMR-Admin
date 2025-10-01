import * as XLSX from 'xlsx';

// Helper function to check if all required headers are present
const hasRequiredHeaders = (headers, required) => required.every(h => headers.includes(h));

export const excelFileToJSON = async (file, dayId = null) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonRows = XLSX.utils.sheet_to_json(worksheet, { raw: false });

                if (!jsonRows.length) {
                    reject(new Error("No data found in the Excel file."));
                    return;
                }
                
                // --- 1. Detect File Format ---
                const headers = Object.keys(jsonRows[0] || {});
                let outputData = [];
                let moduleType = 'Unknown';

                // --- 2. Conversion Logic based on Headers ---

                // QUIZ: question, 1, 2, 3, 4, answer, explanation
                if (hasRequiredHeaders(headers, ['question', 'answer']) && headers.some(h => ['1', '2'].includes(h))) {
                    moduleType = 'quiz';
                    outputData = jsonRows.map((row) => {
                        const options = [];
                        let optionCount = 1;
                        while (row[String(optionCount)]) {
                            options.push({
                                text: String(row[String(optionCount)]),
                                is_correct: optionCount === Number(row.answer)
                            });
                            optionCount++;
                        }
                        if (!row.question || options.length === 0 || !row.answer) return null;

                        return {
                            day_id: dayId,
                            question: String(row.question),
                            options: options,
                            explanation: row.explanation ? String(row.explanation) : undefined,
                        };
                    });

                // AVATAR-TO-STUDENT: title, avatar, student
                } else if (hasRequiredHeaders(headers, ['title', 'avatar', 'student'])) {
                    moduleType = 'avatar-to-student';
                    outputData = jsonRows.map(row => {
                        if (!row.title || !row.avatar || !row.student) return null;
                        return {
                            day_id: dayId,
                            title: String(row.title),
                            avatar: String(row.avatar),
                            student: String(row.student)
                        };
                    });
                
                // STUDENT-TO-AVATAR: title, student, avatar
                } else if (hasRequiredHeaders(headers, ['title', 'student', 'avatar'])) {
                    moduleType = 'student-to-avatar';
                    outputData = jsonRows.map(row => {
                        if (!row.title || !row.student || !row.avatar) return null;
                        return {
                            day_id: dayId,
                            title: String(row.title),
                            student: String(row.student),
                            avatar: String(row.avatar)
                        };
                    });
                
                // VOCABULARY: word, meaning, synonym, antonym, usage
                } else if (hasRequiredHeaders(headers, ['word', 'meaning'])) {
                    moduleType = 'vocabulary';
                    outputData = jsonRows.map(row => {
                        if (!row.word || !row.meaning) return null;
                        return {
                            day_id: dayId,
                            word: String(row.word),
                            meaning: String(row.meaning),
                            synonym: row.synonym ? String(row.synonym) : undefined,
                            antonym: row.antonym ? String(row.antonym) : undefined,
                            usage: row.usage ? String(row.usage) : undefined,
                        };
                    });

                // PRACTICE SENTENCES: title, modal_sentence, 1, 2, ..., 10
                } else if (hasRequiredHeaders(headers, ['title', 'modal_sentence'])) {
                    moduleType = 'practice-sentence';
                    outputData = jsonRows.map(row => {
                        const practiceSentences = [];
                        for (let i = 1; i <= 10; i++) {
                            if (row[String(i)]) {
                                practiceSentences.push(String(row[String(i)]));
                            }
                        }
                        if (!row.title || !row.modal_sentence) return null;
                        
                        return {
                            day_id: dayId,
                            title: String(row.title),
                            modal_sentence: String(row.modal_sentence),
                            practice_sentences: practiceSentences, // Array of strings
                        };
                    });
                }
                
                const validData = outputData.filter(item => item !== null);

                if (validData.length === 0) {
                    reject(new Error(`No valid data found for module type '${moduleType}'. Please check your Excel template headers and data.`));
                } else {
                    resolve(validData);
                }

            } catch (error) {
                // Catches errors during file reading or parsing
                reject(new Error(`Error processing Excel file: ${error.message}`));
            }
        };

        reader.onerror = (error) => {
            reject(new Error(`File reading error: ${error.message}`));
        };

        reader.readAsArrayBuffer(file);
    });
};
