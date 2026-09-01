import { withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { getQuestionAnswerActionStudent } from "../../../redux/actions/studentTestAction";
import apis from '../../../helper/Apis';
import MathText from "../../atoms/MathText/MathText";

const parseMatchColumn = (bodyText) => {
  if (!bodyText) return null;
  const col1Index = bodyText.indexOf("Column I:");
  const col2Index = bodyText.indexOf("Column II:");
  
  if (col1Index === -1 || col2Index === -1) return null;
  
  const instruction = bodyText.substring(0, col1Index).trim();
  const col1Part = bodyText.substring(col1Index + 9, col2Index).trim();
  const col2Part = bodyText.substring(col2Index + 10).trim();
  
  const parseRows = (text) => {
    return text.split(/\n+/).map(line => line.trim()).filter(line => line.length > 0);
  };
  
  return {
    instruction,
    column1: parseRows(col1Part),
    column2: parseRows(col2Part)
  };
};

const getImageUrl = (path) => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  return `${apis.BASE}${path}`;
};

const useStyles = (theme) => ({
  container: {
    padding: '0',
  },
  testTitle: {
    fontSize: '1.5em',
    textAlign: 'center',
    margin: '20px 0',
    fontWeight: '700',
    color: '#1a1a2e',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2em',
      margin: '12px 0',
    }
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e8e8e8',
    [theme.breakpoints.down('xs')]: {
      padding: '14px',
      marginBottom: '12px',
      borderRadius: '10px',
    }
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tkey: {
    marginRight: '10px',
    color: '#3f51b5',
    minWidth: '80px',
    display: 'inline-block',
    padding: '4px 10px',
    background: '#3f51b522',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    [theme.breakpoints.down('xs')]: {
      minWidth: '70px',
      fontSize: '11px',
      padding: '3px 8px',
      marginRight: '6px',
    }
  },
  tbody: {
    margin: '5px',
    background: '#f5f5f5',
    padding: '5px 12px',
    borderRadius: '16px',
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: '1.5',
    wordBreak: 'break-word',
    [theme.breakpoints.down('xs')]: {
      fontSize: '13px',
      padding: '4px 10px',
      margin: '4px 0',
    }
  },
  toption: {
    display: 'inline-block',
    margin: '4px 8px 4px 4px',
    padding: '4px 12px',
    borderRadius: '16px',
    background: '#f5f5f5',
    fontSize: '14px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '13px',
      margin: '3px 4px 3px 0',
      padding: '3px 10px',
    }
  },
  tcorrect: {
    display: 'inline-block',
    margin: '4px 8px 4px 4px',
    padding: '4px 12px',
    borderRadius: '16px',
    color: '#2e7d32',
    background: '#e8f5e9',
    fontWeight: '600',
    fontSize: '14px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '13px',
      margin: '3px 4px 3px 0',
      padding: '3px 10px',
    }
  },
  tfalse: {
    display: 'inline-block',
    margin: '4px 8px 4px 4px',
    padding: '4px 12px',
    borderRadius: '16px',
    color: '#c62828',
    background: '#ffebee',
    fontWeight: '600',
    fontSize: '14px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '13px',
      margin: '3px 4px 3px 0',
      padding: '3px 10px',
    }
  },
  difficultyBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '11px',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
      padding: '3px 8px',
    }
  },
  fieldRow: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '4px',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '8px',
    }
  },
  optionsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
    }
  },
  questionImage: {
    maxHeight: '150px',
    maxWidth: '100%',
    borderRadius: '8px',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '120px',
    }
  },
  optionImage: {
    maxHeight: '40px',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '32px',
    }
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: '1px solid #f0f0f0',
    [theme.breakpoints.down('xs')]: {
      gap: '8px',
    }
  }
})

class TestResultViewQuestions extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    if(this.props.result.resultQuestion!==undefined) {
      var resultQuestion = [];
      for(var i in this.props.result.resultQuestion) {
        let q = this.props.result.resultQuestion[i];
        let normalizedAnswer = q.answer;
        if (q.questionType === 'MULTIPLE' && typeof normalizedAnswer === 'string') {
            normalizedAnswer = normalizedAnswer.split(',');
        }
        
        let normalizedStudentAnswer = this.props.result.answers[i];
        if (q.questionType === 'MULTIPLE' && typeof normalizedStudentAnswer === 'string') {
            normalizedStudentAnswer = normalizedStudentAnswer.split(',');
        }
        
        let time = 0;
        if (this.props.result.timeSpent && this.props.result.timeSpent[i]) {
            time = this.props.result.timeSpent[i];
        }
        
        let revisits = 0;
        if (this.props.result.revisitCounts && this.props.result.revisitCounts[i]) {
            revisits = this.props.result.revisitCounts[i];
        }

        resultQuestion.push({
          ...q,
          answer: normalizedAnswer,
          studentanswer: normalizedStudentAnswer,
          timeSpent: parseFloat(time).toFixed(1),
          revisitCounts: revisits,
          // Auto-calculated difficulty from avg time of all students (not stored DB value)
          autoDifficulty: (() => {
            const avgData = this.props.result.avgTimePerQuestion;
            if (avgData && avgData[i]) {
              return avgData[i].difficulty;
            }
            // Fallback: calculate from this student's own time
            if (time > 120) return 'HARD';
            if (time > 45) return 'MEDIUM';
            return 'EASY';
          })()
        });
      }
      return(<div className={this.props.classes.container}>
        <div className={this.props.classes.testTitle}>Questions</div>
        
        {resultQuestion.map((r, idx) => {
          const qType = r.questionType || 'SINGLE';
          let isCorrect = false;
          if (qType === 'NUMERICAL') {
            isCorrect = !isNaN(parseFloat(r.answer)) && !isNaN(parseFloat(r.studentanswer)) && parseFloat(r.answer).toFixed(2) === parseFloat(r.studentanswer).toFixed(2);
          } else if (qType === 'MULTIPLE') {
             let actualArr = Array.isArray(r.answer) ? r.answer : [r.answer];
             let userArr = Array.isArray(r.studentanswer) ? r.studentanswer : [r.studentanswer];
             if(!r.studentanswer) userArr = [];
             actualArr = actualArr.map(a => String(a)).sort();
             userArr = userArr.map(a => String(a)).sort();
             isCorrect = JSON.stringify(actualArr) === JSON.stringify(userArr);
          } else {
            isCorrect = r.answer === r.studentanswer;
          }
          
          const formatAnswer = (ans) => {
             if(Array.isArray(ans)) return ans.map(a => formatAnswer(a)).join(', ');
             if(ans === undefined || ans === null) return ans;
             if(typeof ans === 'string' && ans.trim() === '') {
               let idx = r.options ? r.options.indexOf(ans) : -1;
               if(idx !== -1) return `Option ${String.fromCharCode(65 + idx)} [Image]`;
               return '[Image Option]';
             }
             return ans;
          }

          return (
            <div key={r._id} className={this.props.classes.questionCard}>
              {/* Question header with auto-calculated difficulty */}
              <div className={this.props.classes.questionHeader}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '15px' }}>Q{idx + 1}.</span>
                <span className={this.props.classes.difficultyBadge} style={{
                  backgroundColor: r.autoDifficulty === 'EASY' ? '#e8f5e9' : r.autoDifficulty === 'HARD' ? '#ffebee' : '#fff8e1',
                  color: r.autoDifficulty === 'EASY' ? '#2e7d32' : r.autoDifficulty === 'HARD' ? '#c62828' : '#f57f17',
                }}>
                  {r.autoDifficulty || 'MEDIUM'}
                </span>
              </div>

              {/* Question body */}
              <div className={this.props.classes.fieldRow} style={{ width: '100%' }}>
                <span className={this.props.classes.tkey}>Question</span>
                <span className={this.props.classes.tbody} style={{ flex: 1, backgroundColor: 'transparent', padding: 0 }}>
                  {(() => {
                    const matchData = parseMatchColumn(r.body);
                    if (matchData) {
                      return (
                        <div style={{ width: '100%' }}>
                          <p style={{ margin: 0, marginBottom: '15px', fontWeight: '500' }}>
                            <MathText text={matchData.instruction} />
                          </p>
                          <div style={{ display: 'flex', gap: '20px', marginBottom: '10px', flexWrap: 'wrap', width: '100%' }}>
                            <div style={{ flex: 1, minWidth: '240px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
                              <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '10px', color: '#1e293b' }}>Column I</div>
                              {matchData.column1.map((item, idx) => (
                                <div key={idx} style={{ padding: '6px 0', fontSize: '14px', color: '#334155' }}>
                                  <MathText text={item} />
                                </div>
                              ))}
                            </div>
                            <div style={{ flex: 1, minWidth: '240px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
                              <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '10px', color: '#1e293b' }}>Column II</div>
                              {matchData.column2.map((item, idx) => (
                                <div key={idx} style={{ padding: '6px 0', fontSize: '14px', color: '#334155' }}>
                                  <MathText text={item} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <span className={this.props.classes.tbody} style={{ flex: 1, margin: 0 }}>
                        <MathText text={r.body} />
                      </span>
                    );
                  })()}
                </span>
              </div>

              {r.bodyImage && r.bodyImage !== 'null' && r.bodyImage !== 'undefined' && String(r.bodyImage).trim() !== '' && (
                <div style={{ marginBottom: '10px' }}>
                  <img src={getImageUrl(r.bodyImage)} alt="question" className={this.props.classes.questionImage} />
                </div>
              )}

              {/* Options */}
              {r.questionType !== 'NUMERICAL' && (
                <div className={this.props.classes.fieldRow}>
                  <span className={this.props.classes.tkey}>Options</span>
                  <div className={this.props.classes.optionsWrap}>
                    {[0, 1, 2, 3].map(optIndex => {
                      const isOptCorrect = r.questionType === 'MULTIPLE' 
                        ? (Array.isArray(r.answer) && r.answer.includes(r.options[optIndex])) 
                        : r.answer === r.options[optIndex];
                      return (
                      <span key={optIndex} className={isOptCorrect ? this.props.classes.tcorrect : this.props.classes.toption} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        {typeof r.options[optIndex] === 'string' && r.options[optIndex].trim() !== '' ? <MathText text={r.options[optIndex]} /> : ''}
                        {r.optionImages && r.optionImages[optIndex] && r.optionImages[optIndex] !== 'null' && r.optionImages[optIndex] !== 'undefined' && String(r.optionImages[optIndex]).trim() !== '' && (
                          <img src={getImageUrl(r.optionImages[optIndex])} alt="option" className={this.props.classes.optionImage} />
                        )}
                      </span>
                    )})}
                  </div>
                </div>
              )}

              {/* Answers */}
              <div className={this.props.classes.fieldRow}>
                <span className={this.props.classes.tkey}>Your Answer</span>
                <span className={isCorrect ? this.props.classes.tcorrect : this.props.classes.tfalse}>
                  {formatAnswer(r.studentanswer) || "(no answer)"}
                </span>
              </div>
              <div className={this.props.classes.fieldRow}>
                <span className={this.props.classes.tkey}>Correct</span>
                <span className={this.props.classes.tcorrect}>{formatAnswer(r.answer)}</span>
              </div>

              {/* Meta info */}
              <div className={this.props.classes.metaRow}>
                <div>
                  <span className={this.props.classes.tkey}>Time</span>
                  <span className={this.props.classes.tbody}>{r.timeSpent}s</span>
                </div>
                <div>
                  <span className={this.props.classes.tkey}>Revisits</span>
                  <span className={this.props.classes.tbody}>{r.revisitCounts}</span>
                </div>
              </div>

              {/* Explanation */}
              {r.explanation && r.explanation.trim() !== '' && (
                <div className={this.props.classes.fieldRow} style={{ marginTop: '8px' }}>
                  <span className={this.props.classes.tkey}>Explanation</span>
                  <span className={this.props.classes.tbody} style={{ flex: 1 }}>{r.explanation}</span>
                </div>
              )}
              {r.explanationImage && r.explanationImage !== 'null' && r.explanationImage !== 'undefined' && String(r.explanationImage).trim() !== '' && (
                <div style={{ marginTop: '5px' }}>
                  <img src={getImageUrl(r.explanationImage)} alt="explanation" className={this.props.classes.questionImage} />
                </div>
              )}
            </div>
          );
        })}
      </div>)
    } else {
      console.log(this.props.result.questions);
      this.props.getQuestionAnswerActionStudent({queids:this.props.result.questions});
      return(<div>processing</div>)
    }
  }
}

const mapStatetoProps = state => ({
  result : state.testDetails.test
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  getQuestionAnswerActionStudent
})(TestResultViewQuestions));
