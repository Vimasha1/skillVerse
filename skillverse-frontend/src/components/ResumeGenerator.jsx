import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResumeGenerator() {
  const userProfile = JSON.parse(sessionStorage.getItem('userProfile'));
  const userId = userProfile?.id;

  const [updates, setUpdates] = useState([]);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState('');
  const resumeRef = useRef();

  // Fetch user's progress updates
  useEffect(() => {
    if (!userId) {
      setError('No user ID found. Please log in.');
      return;
    }
    axios
      .get(`http://localhost:8081/api/progress-updates/user/${userId}`)
      .then(res => setUpdates(res.data))
      .catch(err => setError(`Failed to load progress updates: ${err.message}`));
  }, [userId]);

  // ✅ Gemini API-based Summary Generator
 const generateSummaryWithRetry = async (prompt, attempt = 0) => {
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  if (!API_KEY) throw new Error('Gemini API key is missing.');

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('No response from Gemini.');
    return content.trim();
  } catch (err) {
    console.error('Gemini API Error:', err.response?.data || err.message);
    if (err.response?.status === 429 && attempt < 5) {
      const wait = Math.pow(2, attempt) * 1000;
      console.warn(`Rate limited. Retrying in ${wait / 1000}s...`);
      await new Promise(res => setTimeout(res, wait));
      return generateSummaryWithRetry(prompt, attempt + 1);
    }
    throw err;
  }
};


  const handleGenerateSummary = async () => {
    if (loadingSummary) return;
    if (!updates.length) {
      setError('No progress updates available to generate a summary.');
      return;
    }

    setError('');
    setLoadingSummary(true);

    try {
      const prompt = `
Write a professional, concise “About Me” paragraph based on the following learning progress updates. Focus on achievements and skills gained. Keep it under 100 words.

${updates
  .sort((a, b) => new Date(b.progressDate) - new Date(a.progressDate))
  .map(u => {
    const text = u.templateText
      ? Object.entries(u.extraFields || {}).reduce(
          (txt, [k, v]) => txt.replace(new RegExp(`%${k}%`, 'g'), v || ''),
          u.templateText
        )
      : u.freeText || '';
    return `- ${u.category} (${new Date(u.progressDate).toLocaleDateString()}): ${text}`;
  })
  .join('\n')}
      `.trim();

      console.log('Generated Prompt:', prompt);
      const aiText = await generateSummaryWithRetry(prompt);
      setSummary(aiText);
    } catch (err) {
      console.error('Error:', err);
      setError(`Failed to generate summary: ${err.message}`);
    } finally {
      setLoadingSummary(false);
    }
  };

  const downloadPDF = () => {
    const input = resumeRef.current;
    html2canvas(input, { scale: 2 })
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${userProfile?.firstName || 'User'}_${userProfile?.lastName || 'Resume'}_Resume.pdf`);
      })
      .catch(err => setError(`Failed to generate PDF: ${err.message}`));
  };

return (
  <div className="bg-gray-100 min-h-screen py-10 px-4">
    <div ref={resumeRef} className="bg-white max-w-3xl mx-auto px-10 py-8 shadow rounded-lg text-gray-800 font-sans leading-relaxed">
      {/* Header Section */}
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-wide text-gray-900">
            {userProfile?.firstName} {userProfile?.lastName}
          </h1>
          <p className="text-gray-500 text-md mt-1 uppercase">{userProfile?.jobPosition || 'Your Position'}</p>
        </div>
        <div className="text-sm text-right text-gray-700 space-y-1 mt-1">
          <p>{userProfile?.email || 'email@example.com'}</p>
          <p>{userProfile?.phone || '123-456-7890'}</p>
          <p>{userProfile?.address || 'Address here'}</p>
        </div>
      </div>

      {/* Summary */}
      <section className="mt-6">
        <h2 className="text-lg font-bold text-indigo-600 mb-1">Profile Summary</h2>
        <p className="text-gray-700">
          {summary || 'Click "Generate Summary" to get your AI-written paragraph.'}
        </p>
      </section>

      {/* Education */}
      <section className="mt-6">
        <h2 className="text-lg font-bold text-indigo-600 mb-1">Education</h2>
        <p className="text-gray-800">{userProfile?.education || '—'}</p>
      </section>

      {/* Progress Updates */}
      <section className="mt-6">
        <h2 className="text-lg font-bold text-indigo-600 mb-2">Progress Updates</h2>
        <ul className="space-y-3 text-gray-700 text-sm">
          {updates
            .sort((a, b) => new Date(b.progressDate) - new Date(a.progressDate))
            .map((u) => {
              const text = u.templateText
                ? Object.entries(u.extraFields || {}).reduce(
                    (txt, [k, v]) => txt.replace(new RegExp(`%${k}%`, 'g'), v || ''),
                    u.templateText
                  )
                : u.freeText || '';
              const emoji =
                u.category === 'Certification'
                  ? '🎓'
                  : u.category === 'Project Milestone'
                  ? '🍀'
                  : u.category === 'Skill Acquired'
                  ? '🛠️'
                  : '📌';

              return (
                <li key={u.id}>
                  <strong>{u.category}</strong> ({new Date(u.progressDate).toLocaleDateString()}):{' '}
                  {emoji} {text}
                </li>
              );
            })}
        </ul>
      </section>
    </div>

    {/* Action Buttons */}
    <div className="mt-6 flex justify-center space-x-4">
      <button
        onClick={handleGenerateSummary}
        disabled={loadingSummary}
        className={`px-5 py-2 rounded text-white font-semibold shadow ${
          loadingSummary ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loadingSummary ? 'Generating...' : 'Generate Summary'}
      </button>
      <button
        onClick={downloadPDF}
        className="px-5 py-2 bg-green-600 text-white font-semibold rounded shadow hover:bg-green-700"
      >
        Download PDF
      </button>
    </div>
  </div>
);


}
