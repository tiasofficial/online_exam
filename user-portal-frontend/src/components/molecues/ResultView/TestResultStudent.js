import { withStyles } from "@material-ui/styles";
import React from "react";
import { connect } from "react-redux";
import { Button, Typography, Chip } from "@material-ui/core";
import { getCompletedTestsStudentAction } from "../../../redux/actions/studentTestAction";
import { TableCell, TableContainer, Table, TableBody, TableRow, Paper, TableHead } from "@material-ui/core";
import TestResultViewQuestions from "./TestResultViewQuestions";
import { setAlert } from "../../../redux/actions/alertAction";
import html2pdf from "html2pdf.js";
import katex from "katex";
import axios from "axios";
import apis from "../../../helper/Apis";
import Auth from "../../../helper/Auth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const useStyles = (theme)=> ({
  tableBorder:{
    background:'#f0f2f5',
    padding:'15px',
    [theme.breakpoints.down('xs')]: {
      padding: '8px',
    }
  },
  tableHeader:{
    background:'#3f51b5',
    color:'white'
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e8e8e8',
  },
  resultHeader: {
    background: 'linear-gradient(135deg, #3f51b5, #5c6bc0)',
    padding: '16px 20px',
    [theme.breakpoints.down('xs')]: {
      padding: '14px 16px',
    }
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
      borderBottom: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '12px 16px',
      flexWrap: 'wrap',
      gap: '4px',
    }
  },
  detailLabel: {
    fontSize: '13px',
    color: '#8c8c8c',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '15px',
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px',
      maxWidth: '100%',
      textAlign: 'right',
    }
  },
  actionArea: {
    padding: '16px 20px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    [theme.breakpoints.down('xs')]: {
      padding: '12px 16px',
      flexDirection: 'column',
    }
  },
  actionBtn: {
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: '600',
    padding: '12px 20px',
    fontSize: '14px',
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      flex: 'unset',
      width: '100%',
    }
  },
  leaderboardSection: {
    marginTop: '20px',
    [theme.breakpoints.down('xs')]: {
      marginTop: '16px',
    }
  },
  leaderboardTitle: {
    color: '#3f51b5',
    fontWeight: '700',
    fontSize: '18px',
    marginBottom: '12px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
      marginBottom: '8px',
    }
  },
  leaderboardTable: {
    overflowX: 'auto',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  rankBadge: {
    fontWeight: '800',
    fontSize: '20px',
    color: '#3f51b5',
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
    }
  },
  // Mobile leaderboard cards
  leaderboardCard: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    }
  },
  leaderboardDesktop: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    }
  },
  lbCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #f0f0f0',
  },
  lbRank: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#e8eaf6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '14px',
    color: '#3f51b5',
    marginRight: '12px',
    flexShrink: 0,
  },
  lbName: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  lbScore: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3f51b5',
    marginLeft: '8px',
  },
  chartSection: {
    marginTop: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e8e8e8',
    [theme.breakpoints.down('xs')]: {
      padding: '14px',
    }
  }
})


const getImageUrl = (path) => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  return `${apis.BASE}${path}`;
};

const cleanLatexText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\\text\{\s*%\s*\}/gi, '%')
    .replace(/\\text\{%\}/gi, '%')
    .replace(/\\text\{\s*\\%\s*\}/gi, '%')
    .replace(/-\\text\{([a-zA-Z0-9_]+)\}\$/gi, '-$1')
    .replace(/-\\text\{([a-zA-Z0-9_]+)\}/gi, '-$1')
    .replace(/\\text\{([a-zA-Z0-9_\s,]+)\}/gi, '$1')
    .replace(/\\circC/gi, '°C')
    .replace(/\^\\circ C/gi, '°C')
    .replace(/\^\\circ/gi, '°')
    .replace(/\\cdot([a-zA-Z0-9])/gi, ' · $1')
    .replace(/\\cdot\b/gi, ' · ')
    .replace(/\\to\b/gi, '→')
    .replace(/\\rightarrow\b/gi, '→');
};

const formatMathToHtml = (rawText) => {
  if (!rawText) return '';
  const text = cleanLatexText(rawText);

  const masterRegex = /(<svg[^]+?<\/svg>|\$\$[^]+?\$\$|\$[^]+?\$|\\\(.*?\\\)|\\\[.*?\\\]|\*\*.*?\*\*)/gi;
  const parts = text.split(masterRegex);

  return parts.map(part => {
    if (!part) return '';
    if (part.toLowerCase().startsWith('<svg') && part.toLowerCase().endsWith('</svg>')) {
      return `<div style="display:block; margin: 10px auto; text-align: center; max-width: 100%;">${part}</div>`;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return `<strong>${part.slice(2, -2)}</strong>`;
    }
    let isMath = false;
    let mathContent = part;
    if (part.startsWith('$$') && part.endsWith('$$')) {
      isMath = true;
      mathContent = part.slice(2, -2).trim();
    } else if (part.startsWith('$') && part.endsWith('$')) {
      isMath = true;
      mathContent = part.slice(1, -1).trim();
    } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
      isMath = true;
      mathContent = part.slice(2, -2).trim();
    } else if (part.startsWith('\\[') && part.endsWith('\\]')) {
      isMath = true;
      mathContent = part.slice(2, -2).trim();
    } else if (part.includes('\\frac') || part.includes('\\sqrt') || part.includes('\\mathrm')) {
      isMath = true;
      mathContent = part.replace(/^\\\(|\\\)$/g, '').trim();
    }

    if (isMath && mathContent) {
      try {
        return katex.renderToString(mathContent, { displayMode: false, throwOnError: false });
      } catch (e) {
        return part;
      }
    }
    return part.replace(/\n/g, '<br/>');
  }).join('');
};

const formatAnsHtml = (ans, q) => {
  if (Array.isArray(ans)) return ans.map(a => formatAnsHtml(a, q)).join(', ');
  if (ans == null || ans === '') return "<span style='color:#94a3b8; font-style: italic;'>Not Attempted</span>";
  let idx = q.options ? q.options.indexOf(ans) : -1;
  if (idx !== -1 && q.optionImages && q.optionImages[idx] && q.optionImages[idx] !== 'null' && q.optionImages[idx] !== 'undefined') {
    return `<div style="display:flex; align-items:center; gap: 8px;"><strong>Option ${String.fromCharCode(65 + idx)}</strong> <img src="${getImageUrl(q.optionImages[idx])}" style="max-height: 50px;" /></div>`;
  }
  if (typeof ans === 'string' && ans.trim() === '') {
    if (idx !== -1) return `Option ${String.fromCharCode(65 + idx)}`;
    return '<span>[Image Option]</span>';
  }
  return formatMathToHtml(String(ans));
};

class TestResultStudent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toggleViewQue : false
    }
  }

  onViewQuestions(event, result){
    if(result.status !== 'RESULT_DECLARED') {
      this.props.setAlert({
        type : 'info',
        title:'No Result',
        message : 'test result is not declared'
      })
      return;
    }
    this.setState({
      ...this.state,
      toggleViewQue : !this.state.toggleViewQue
    })
  }

  goBack() {
    this.props.getCompletedTestsStudentAction();
  }

  downloadPDF = async () => {
    const test = this.props.test;
    const user = this.props.user;

    if (!test) return;

    this.props.setAlert({
      isAlert: true,
      type: 'info',
      title: 'Preparing PDF',
      message: 'Generating complete result report, please wait...'
    });

    let questions = test.resultQuestion;
    if (!questions || questions.length === 0) {
      try {
        const res = await axios.post(apis.BASE + apis.GET_RESULT_QUESTIONS_STUDENTS, { queids: test.questions }, {
          headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
        });
        if (res.data.success && res.data.questions) {
          questions = res.data.questions;
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (!questions || questions.length === 0) {
      this.props.setAlert({
        isAlert: true,
        type: 'error',
        title: 'Error',
        message: 'Could not fetch test questions for PDF generation.'
      });
      return;
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    questions.forEach((q, index) => {
      const qType = q.questionType || 'SINGLE';
      const studentAns = test.answers ? test.answers[index] : null;
      const isAttempted = studentAns != null && studentAns !== '' && (Array.isArray(studentAns) ? studentAns.length > 0 : true);

      if (!isAttempted) {
        unattemptedCount++;
      } else {
        let isCorrect = false;
        if (qType === 'NUMERICAL') {
          isCorrect = !isNaN(parseFloat(q.answer)) && !isNaN(parseFloat(studentAns)) && parseFloat(q.answer).toFixed(2) === parseFloat(studentAns).toFixed(2);
        } else if (qType === 'MULTIPLE') {
          let actualArr = Array.isArray(q.answer) ? q.answer : (typeof q.answer === 'string' ? q.answer.split(',') : [q.answer]);
          let userArr = Array.isArray(studentAns) ? studentAns : [studentAns];
          actualArr = actualArr.map(a => String(a).trim()).sort();
          userArr = userArr.map(a => String(a).trim()).sort();
          isCorrect = JSON.stringify(actualArr) === JSON.stringify(userArr);
        } else {
          isCorrect = String(q.answer).trim() === String(studentAns).trim();
        }

        if (isCorrect) correctCount++;
        else incorrectCount++;
      }
    });

    const studentName = user ? (user.username || user.name || 'Student') : 'Student';
    const studentEmail = user ? (user.email || '') : '';
    const testTitle = test.title || 'Test Result';
    const scoreText = `${test.score !== undefined ? test.score : 0} / ${test.maxmarks || 300}`;
    const rankText = test.rank ? `#${test.rank}` : 'N/A';

    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${studentName} - ${testTitle} Result</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.css" />
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      background-color: #f8fafc;
      color: #1e293b;
      line-height: 1.5;
    }
    .no-print-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      color: white;
      padding: 12px 24px;
      margin: -24px -24px 24px -24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .btn {
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-print { background: #22c55e; color: white; }
    .btn-print:hover { background: #16a34a; }
    .btn-close { background: #475569; color: white; }
    .btn-close:hover { background: #334155; }
    
    .report-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .report-header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 12px;
    }
    .report-title {
      font-size: 24px;
      font-weight: 800;
      color: #1e3a8a;
      margin: 0 0 6px 0;
    }
    .student-meta {
      font-size: 14px;
      color: #64748b;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .stat-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      text-align: center;
    }
    .stat-box.success { background: #f0fdf4; border-color: #bbf7d0; }
    .stat-box.danger { background: #fef2f2; border-color: #fecaca; }
    .stat-box.primary { background: #eff6ff; border-color: #bfdbfe; }
    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 4px;
    }
    .stat-val {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
    }
    .stat-box.success .stat-val { color: #16a34a; }
    .stat-box.danger .stat-val { color: #dc2626; }
    .stat-box.primary .stat-val { color: #2563eb; }

    .questions-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin: 28px 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #cbd5e1;
    }
    .q-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 18px 20px;
      margin-bottom: 16px;
      page-break-inside: avoid;
      break-inside: avoid;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .q-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;
      flex-wrap: wrap;
    }
    .q-num {
      font-weight: 800;
      font-size: 15px;
      color: #1e40af;
    }
    .badges {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .badge {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .badge-correct { background: #dcfce7; color: #15803d; }
    .badge-wrong { background: #fee2e2; color: #b91c1c; }
    .badge-unattempted { background: #f1f5f9; color: #64748b; }
    .badge-easy { background: #dcfce7; color: #166534; }
    .badge-medium { background: #fef9c3; color: #854d0e; }
    .badge-hard { background: #fee2e2; color: #991b1b; }

    .q-body {
      font-size: 15px;
      color: #1e293b;
      margin-bottom: 14px;
      line-height: 1.6;
    }
    .q-img {
      max-height: 220px;
      max-width: 100%;
      display: block;
      margin: 10px 0;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 14px;
    }
    @media (max-width: 600px) {
      .options-grid { grid-template-columns: 1fr; }
    }
    .opt-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .opt-letter {
      font-weight: 700;
      color: #3b82f6;
      min-width: 20px;
    }

    .ans-compare {
      display: flex;
      gap: 16px;
      background: #f1f5f9;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .ans-part { flex: 1; min-width: 150px; }
    .ans-part-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
    }
    .ans-part-val {
      font-size: 14px;
      font-weight: 600;
    }

    .meta-footer {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #64748b;
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px dashed #e2e8f0;
    }
    .explanation-box {
      margin-top: 12px;
      padding: 12px 14px;
      background: #f0fdf4;
      border-left: 4px solid #22c55e;
      border-radius: 0 6px 6px 0;
      font-size: 13px;
    }
    .explanation-title {
      font-weight: 700;
      color: #166534;
      margin-bottom: 4px;
      text-transform: uppercase;
      font-size: 11px;
    }

    @media print {
      body { background: white; padding: 0; }
      .no-print-toolbar { display: none !important; }
      .report-card, .q-card { box-shadow: none; border-color: #cbd5e1; }
      .q-card { page-break-inside: avoid !important; break-inside: avoid !important; }
    }
  </style>
</head>
<body>
  <div class="no-print-toolbar">
    <span style="font-size:15px; font-weight:600;">Test Result Document</span>
    <div style="display:flex; gap:10px;">
      <button class="btn btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
      <button class="btn btn-close" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="report-card">
    <div class="report-header">
      <div>
        <h1 class="report-title">${testTitle}</h1>
        <div class="student-meta">Student: <strong>${studentName}</strong> (${studentEmail}) &nbsp;|&nbsp; Date: ${new Date().toLocaleDateString()}</div>
      </div>
    </div>

    <div class="summary-grid">
      <div class="stat-box primary">
        <div class="stat-label">Score</div>
        <div class="stat-val">${scoreText}</div>
      </div>
      <div class="stat-box primary">
        <div class="stat-label">Rank</div>
        <div class="stat-val">${rankText}</div>
      </div>
      <div class="stat-box success">
        <div class="stat-label">Correct</div>
        <div class="stat-val">${correctCount}</div>
      </div>
      <div class="stat-box danger">
        <div class="stat-label">Incorrect</div>
        <div class="stat-val">${incorrectCount}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Unattempted</div>
        <div class="stat-val">${unattemptedCount}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Total Questions</div>
        <div class="stat-val">${questions.length}</div>
      </div>
    </div>
  </div>

  <div class="questions-title">Questions & Solutions (${questions.length} Total)</div>
`;

    questions.forEach((q, index) => {
      if (!q) return;
      const qType = q.questionType || 'SINGLE';
      const studentAns = test.answers ? test.answers[index] : null;
      const isAttempted = studentAns != null && studentAns !== '' && (Array.isArray(studentAns) ? studentAns.length > 0 : true);

      let isCorrect = false;
      if (isAttempted) {
        if (qType === 'NUMERICAL') {
          isCorrect = !isNaN(parseFloat(q.answer)) && !isNaN(parseFloat(studentAns)) && parseFloat(q.answer).toFixed(2) === parseFloat(studentAns).toFixed(2);
        } else if (qType === 'MULTIPLE') {
          let actualArr = Array.isArray(q.answer) ? q.answer : (typeof q.answer === 'string' ? q.answer.split(',') : [q.answer]);
          let userArr = Array.isArray(studentAns) ? studentAns : [studentAns];
          actualArr = actualArr.map(a => String(a).trim()).sort();
          userArr = userArr.map(a => String(a).trim()).sort();
          isCorrect = JSON.stringify(actualArr) === JSON.stringify(userArr);
        } else {
          isCorrect = String(q.answer).trim() === String(studentAns).trim();
        }
      }

      let statusBadge = `<span class="badge badge-unattempted">⚪ Not Attempted</span>`;
      if (isAttempted) {
        statusBadge = isCorrect 
          ? `<span class="badge badge-correct">✓ Correct (+${q.marks || 4})</span>` 
          : `<span class="badge badge-wrong">✗ Incorrect (-1)</span>`;
      }

      const diff = q.difficulty ? q.difficulty.toUpperCase() : 'MEDIUM';
      const diffClass = diff === 'HARD' ? 'badge-hard' : (diff === 'EASY' ? 'badge-easy' : 'badge-medium');

      const studentAnsHtml = isAttempted ? formatAnsHtml(studentAns, q) : '<span style="color:#94a3b8; font-style:italic;">Not Attempted</span>';
      const correctAnsHtml = formatAnsHtml(q.answer, q);

      html += `
  <div class="q-card">
    <div class="q-header">
      <div class="q-num">Question ${index + 1}</div>
      <div class="badges">
        <span class="badge ${diffClass}">${diff}</span>
        ${statusBadge}
      </div>
    </div>

    <div class="q-body">${formatMathToHtml(q.body || '')}</div>
    ${q.bodyImage && q.bodyImage !== 'null' && q.bodyImage !== 'undefined' && String(q.bodyImage).trim() !== '' ? `<img class="q-img" src="${getImageUrl(q.bodyImage)}" alt="Question Diagram" />` : ''}

    ${q.options && q.options.length > 0 ? `
      <div class="options-grid">
        ${q.options.map((opt, oIdx) => {
          let optImgHtml = '';
          if (q.optionImages && q.optionImages[oIdx] && q.optionImages[oIdx] !== 'null' && q.optionImages[oIdx] !== 'undefined') {
            optImgHtml = `<img src="${getImageUrl(q.optionImages[oIdx])}" style="max-height: 40px; margin-left: 6px;" />`;
          }
          return `<div class="opt-box">
            <span class="opt-letter">(${String.fromCharCode(65 + oIdx)})</span>
            <div>${formatMathToHtml(opt || '')} ${optImgHtml}</div>
          </div>`;
        }).join('')}
      </div>
    ` : ''}

    <div class="ans-compare">
      <div class="ans-part">
        <div class="ans-part-title">Your Answer</div>
        <div class="ans-part-val" style="color: ${!isAttempted ? '#64748b' : (isCorrect ? '#16a34a' : '#dc2626')};">${studentAnsHtml}</div>
      </div>
      <div class="ans-part">
        <div class="ans-part-title">Correct Answer</div>
        <div class="ans-part-val" style="color: #16a34a;">${correctAnsHtml}</div>
      </div>
    </div>

    ${((q.explanation && q.explanation.trim() !== '') || (q.explanationImage && q.explanationImage !== 'null' && q.explanationImage !== 'undefined')) ? `
      <div class="explanation-box">
        <div class="explanation-title">Explanation / Solution</div>
        <div>${formatMathToHtml(q.explanation || '')}</div>
        ${q.explanationImage && q.explanationImage !== 'null' && q.explanationImage !== 'undefined' && String(q.explanationImage).trim() !== '' ? `<img class="q-img" style="max-height: 140px;" src="${getImageUrl(q.explanationImage)}" alt="Solution Diagram" />` : ''}
      </div>
    ` : ''}

    <div class="meta-footer">
      <span>Time Spent: <strong>${test.timeSpent && test.timeSpent[index] != null ? parseFloat(test.timeSpent[index]).toFixed(1) : 0}s</strong></span>
      <span>Revisits: <strong>${test.revisitCounts && test.revisitCounts[index] != null ? test.revisitCounts[index] : 0}</strong></span>
    </div>
  </div>`;
    });

    html += `
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 700);
    };
  </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    } else {
      let iframe = document.getElementById('print-result-iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'print-result-iframe';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
      }
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }, 800);
    }
  };

  render() {
    var test = this.props.test;

    // Prepare chart data from auto-calculated avg difficulty (backend) or fallback to personal time
    let chartData = [];
    if (test && test.questions) {
      if (test.avgTimePerQuestion && test.avgTimePerQuestion.length > 0) {
        // Use backend auto-calculated avg time (shown after result declared)
        chartData = test.avgTimePerQuestion.map((item, index) => {
          const colorMap = { EASY: '#4caf50', MEDIUM: '#ff9800', HARD: '#f44336' };
          return {
            name: `Q${item.questionIndex + 1}`,
            AvgTime: item.avgTime,
            MyTime: (test.timeSpent && test.timeSpent[item.questionIndex]) || 0,
            Difficulty: item.difficulty,
            color: colorMap[item.difficulty] || '#9c27b0'
          };
        });
      } else if (test.timeSpent) {
        // Fallback: personal time only (before result declared)
        chartData = test.questions.map((qId, index) => {
          const time = test.timeSpent[index] || 0;
          let difficulty = 'EASY', color = '#4caf50';
          if (time > 120) { difficulty = 'HARD'; color = '#f44336'; }
          else if (time > 45) { difficulty = 'MEDIUM'; color = '#ff9800'; }
          return { name: `Q${index+1}`, AvgTime: time, MyTime: time, Difficulty: difficulty, color };
        });
      }
    }

    return (<div className={this.props.classes.tableBorder} id="pdf-content"> 
      <div className={this.props.classes.resultCard}>
        <div className={this.props.classes.resultHeader}>
          <Typography variant="h6" style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>
            {test.title}
          </Typography>
        </div>

        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Student</span>
          <span className={this.props.classes.detailValue}>{this.props.user.username}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Status</span>
          <span className={this.props.classes.detailValue} style={{ textTransform: 'lowercase' }}>{test.status}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Subjects</span>
          <span className={this.props.classes.detailValue}>{test.subjects}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Total Marks</span>
          <span className={this.props.classes.detailValue}>{test.maxmarks}</span>
        </div>
        <div className={this.props.classes.detailRow}>
          <span className={this.props.classes.detailLabel}>Obtained Marks</span>
          <span className={this.props.classes.detailValue}>
            {test.status === 'RESULT_DECLARED' ? (
              <span style={{ color: '#2e7d32', fontWeight: '800', fontSize: '18px' }}>{test.score}</span>
            ) : (
              <span style={{ fontSize: '12px', color: '#e65100' }}>
                Result on: {test.resultTime ? new Date(test.resultTime).toLocaleString() : 'Not set'}
              </span>
            )}
          </span>
        </div>
        {test.status === 'RESULT_DECLARED' && test.rank !== null && (
          <div className={this.props.classes.detailRow}>
            <span className={this.props.classes.detailLabel}>Your Rank</span>
            <span className={this.props.classes.rankBadge}>#{test.rank}</span>
          </div>
        )}

        <div className={this.props.classes.actionArea} id="pdf-actions">
          <Button 
            variant="contained" 
            color="primary" 
            className={this.props.classes.actionBtn}
            onClick={(event)=>(this.onViewQuestions(event,test))}
          >
            View Questions
          </Button>
          <Button 
            variant="outlined" 
            className={this.props.classes.actionBtn}
            onClick={(event)=>(this.goBack(event))}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            className={this.props.classes.actionBtn}
            onClick={() => this.downloadPDF()}
            style={{ backgroundColor: '#2e7d32', color: '#fff' }}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {test.status === 'RESULT_DECLARED' && test.leaderboard && test.leaderboard.length > 0 && (
        <div className={this.props.classes.leaderboardSection}>
          <Typography className={this.props.classes.leaderboardTitle}>🏆 Top 3 Leaderboard</Typography>
                  {/* Desktop leaderboard table */}
          <div className={this.props.classes.leaderboardDesktop}>
            <TableContainer component={Paper} className={this.props.classes.leaderboardTable}>
              <Table size="small">
                <TableHead style={{ backgroundColor: '#3f51b5' }}>
                  <TableRow>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Student Name</TableCell>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {test.leaderboard.slice(0, 3).map((student) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const medal = medals[student.rank - 1] || `#${student.rank}`;
                    return (
                      <TableRow 
                        key={student.rank + student.studentName} 
                        style={{ backgroundColor: student.isCurrentUser ? '#e8eaf6' : student.rank === 1 ? '#fffde7' : student.rank === 2 ? '#f5f5f5' : student.rank === 3 ? '#fff8e1' : 'inherit' }}
                      >
                        <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>{medal}</TableCell>
                        <TableCell style={{ fontWeight: student.isCurrentUser ? 'bold' : 'normal' }}>
                          {student.studentName} {student.isCurrentUser ? '(You)' : ''}
                        </TableCell>
                        <TableCell style={{ fontWeight: student.isCurrentUser ? 'bold' : 'normal' }}>{student.score}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Mobile leaderboard cards */}
          <div className={this.props.classes.leaderboardCard}>
            {test.leaderboard.slice(0, 3).map((student) => {
              const medals = ['🥇', '🥈', '🥉'];
              const medal = medals[student.rank - 1] || `#${student.rank}`;
              return (
                <div 
                  key={student.rank + student.studentName} 
                  className={this.props.classes.lbCard}
                  style={{ 
                    backgroundColor: student.isCurrentUser ? '#e8eaf6' : student.rank === 1 ? '#fffde7' : '#fff',
                    borderColor: student.isCurrentUser ? '#3f51b5' : '#f0f0f0',
                  }}
                >
                  <div className={this.props.classes.lbRank} style={{ fontSize: '20px', backgroundColor: 'transparent' }}>{medal}</div>
                  <span className={this.props.classes.lbName}>
                    {student.studentName} {student.isCurrentUser ? '(You)' : ''}
                  </span>
                  <span className={this.props.classes.lbScore}>{student.score}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {test.status === 'RESULT_DECLARED' && chartData.length > 0 && (
        <div className={this.props.classes.chartSection}>
          <Typography variant="h6" style={{ marginBottom: '4px', color: '#3f51b5', fontWeight: 'bold' }}>
            Question Difficulty Analysis
          </Typography>
          <Typography variant="body2" style={{ marginBottom: '4px', color: '#666', fontSize: '12px' }}>
            Based on average time spent by all students
          </Typography>
          <Typography variant="body2" style={{ marginBottom: '16px', color: '#666' }}>
            <span style={{ color: '#f44336', fontWeight: 'bold' }}>Hard (&gt;2 mins avg)</span> | 
            <span style={{ color: '#ff9800', fontWeight: 'bold', marginLeft: '8px' }}>Medium (45s–2 mins avg)</span> | 
            <span style={{ color: '#4caf50', fontWeight: 'bold', marginLeft: '8px' }}>Easy (&lt;45s avg)</span>
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} label={{ value: 'Avg seconds', angle: -90, position: 'insideLeft', offset: 20, style: { fontSize: 11 } }} />
              <RechartsTooltip 
                 formatter={(value, name, props) => [
                   `Avg: ${props.payload.AvgTime}s | Your time: ${props.payload.MyTime}s (${props.payload.Difficulty})`,
                   'Time'
                 ]}
              />
              <Bar dataKey="AvgTime" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <br/>
      { this.state.toggleViewQue === true ? <TestResultViewQuestions/>: ""}
      </div>)
  }
}


const mapStatetoProps = state => ({
  test : state.testDetails.test,
  user : state.user.userDetails
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  getCompletedTestsStudentAction,
  setAlert
})(TestResultStudent));
