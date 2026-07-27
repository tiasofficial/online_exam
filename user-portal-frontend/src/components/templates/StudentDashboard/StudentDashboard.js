import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { 
  Paper, Typography, CircularProgress, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Box, Chip
} from '@material-ui/core';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import axios from 'axios';
import apis from '../../../helper/Apis';
import Auth from '../../../helper/Auth';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5),
    }
  },
  section: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3),
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(1.5),
      borderRadius: '10px',
    }
  },
  headerBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '8px',
      marginBottom: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    }
  },
  title: {
    fontWeight: '800',
    color: '#1e293b',
  },
  subtitle: {
    color: '#64748b',
    fontWeight: '600',
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
    boxShadow: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflowX: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1.5),
      marginBottom: theme.spacing(2),
    }
  },
  tableHead: {
    backgroundColor: '#f1f5f9',
  },
  tableHeadCell: {
    fontWeight: 'bold',
    color: '#334155',
  },
  chartContainer: {
    height: 300,
    width: '100%',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      height: 220,
      marginTop: theme.spacing(1),
    }
  },
  chartCard: {
    height: '100%',
    boxShadow: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  scoreCircle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneWeak: { backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 'bold' },
  zoneMedium: { backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 'bold' },
  zoneStrong: { backgroundColor: '#dcfce3', color: '#166534', fontWeight: 'bold' },
  // Mobile-only card styles for subject breakdown
  desktopTable: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    }
  },
  mobileSubjectCards: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    }
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '10px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  subjectCardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectCardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    borderBottom: '1px solid #f8fafc',
    fontSize: '13px',
  },
  subjectCardLabel: {
    color: '#8c8c8c',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: '11px',
    letterSpacing: '0.4px',
  },
  subjectCardValue: {
    color: '#333',
    fontWeight: '600',
  },
  statsRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
    flexWrap: 'wrap',
  },
  statBadge: {
    padding: '4px 10px',
    borderRadius: '14px',
    fontSize: '12px',
    fontWeight: '700',
  },
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const DIFFICULTY_COLORS = { EASY: '#4ade80', MEDIUM: '#fbbf24', HARD: '#f87171' };

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analytics: null,
      upcomingTests: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchAnalytics();
    this.fetchUpcomingTests();
  }

  fetchUpcomingTests = async () => {
    try {
      const response = await axios.get(apis.BASE + '/api/v1/user/getUpcomingTests', {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      if (response.data.success) {
        this.setState({ upcomingTests: response.data.upcomingtestlist || [] });
      }
    } catch (err) {
      console.log(err);
    }
  }

  fetchAnalytics = async () => {
    try {
      const response = await axios.get(apis.BASE + '/api/v1/user/getStudentDashboardAnalytics', {
        headers: { 'Authorization': `Bearer ${Auth.retriveToken()}` }
      });
      console.log("Analytics API Response:", response.data);
      if (response.data.success) {
        this.setState({ analytics: response.data.data, loading: false });
      } else {
        this.setState({ error: response.data.message, loading: false });
      }
    } catch (err) {
      console.log(err);
      this.setState({ error: 'Failed to fetch analytics', loading: false });
    }
  }

  getZoneChip = (zone, classes) => {
    const cls = zone === 'WEAK' ? classes.zoneWeak : (zone === 'MEDIUM' ? classes.zoneMedium : classes.zoneStrong);
    return <Chip label={zone} className={cls} size="small" />;
  }

  render() {
    const { classes } = this.props;
    const { analytics, upcomingTests, loading, error } = this.state;

    if (loading) {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress size={60} /></div>;
    }

    if (error) {
      return <Typography color="error" variant="h6" align="center" style={{marginTop: '20px'}}>{error}</Typography>;
    }

    const nextTest = upcomingTests.length > 0 
      ? [...upcomingTests].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0] 
      : null;

    return (
      <Box className={classes.root}>
        {nextTest && (
          <Card style={{ backgroundColor: '#f0f9ff', marginBottom: '32px', borderLeft: '6px solid #0284c7', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <CardContent style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <Typography variant="subtitle2" style={{ color: '#0369a1', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📌 Next Upcoming Test
                  </Typography>
                  <Typography variant="h5" style={{ marginTop: '4px', fontWeight: '800', color: '#0f172a' }}>
                    {nextTest.title}
                  </Typography>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '20px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Typography variant="body2" style={{ color: '#0369a1', fontWeight: '500' }}>
                    Starts on: <strong style={{ color: '#0f172a' }}>{new Date(nextTest.startTime).toLocaleString()}</strong>
                  </Typography>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '20px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Typography variant="body2" style={{ color: '#0369a1', fontWeight: '500' }}>
                    Duration: <strong style={{ color: '#0f172a' }}>{nextTest.duration / 60} mins</strong>
                  </Typography>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '20px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Typography variant="body2" style={{ color: '#0369a1', fontWeight: '500' }}>
                    Total Marks: <strong style={{ color: '#0f172a' }}>{nextTest.maxmarks}</strong>
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Typography variant="h4" gutterBottom style={{ fontWeight: '800', color: '#1e293b', fontSize: 'clamp(1.4rem, 4vw, 2.125rem)' }}>Performance Dashboard</Typography>
        <Typography variant="subtitle1" style={{ color: '#64748b', marginBottom: '24px', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>Analyze your strengths and weaknesses across all completed tests.</Typography>
        
        {(!analytics || analytics.length === 0) ? (
          <Paper className={classes.section} style={{ textAlign: 'center', padding: '40px' }}>
            <Typography variant="h6" color="textSecondary">No analytics available yet.</Typography>
            <Typography variant="body1" color="textSecondary">Take a test to see your performance metrics here.</Typography>
          </Paper>
        ) : (
          analytics.map(testItem => {
            // Prepare Chart Data
            const accuracyData = [];
            const difficultyData = [];
            
            Object.keys(testItem.subjects).forEach(subId => {
              const sub = testItem.subjects[subId];
              if (sub.totalPossibleMarks > 0 && sub.obtainedMarks !== sub.totalPossibleMarks) {
                accuracyData.push({
                  subject: sub.subjectName,
                  Accuracy: parseFloat((sub.accuracy * 100).toFixed(1))
                });

                difficultyData.push({
                  subject: sub.subjectName,
                  'Easy Correct': sub.difficultyStats.EASY ? sub.difficultyStats.EASY.correct : 0,
                  'Med Correct': sub.difficultyStats.MEDIUM ? sub.difficultyStats.MEDIUM.correct : 0,
                  'Hard Correct': sub.difficultyStats.HARD ? sub.difficultyStats.HARD.correct : 0,
                });
              }
            });

            const overallPercentage = testItem.totalPossibleMarks > 0 
              ? Math.max(0, (testItem.overallScore / testItem.totalPossibleMarks) * 100) 
              : 0;

            const radialData = [{ name: 'Score', value: overallPercentage, fill: '#3b82f6' }];

            return (
              <Paper key={testItem.testId} className={classes.section}>
                
                {/* Header Section */}
                <Box className={classes.headerBox}>
                  <Box>
                    <Typography variant="h5" className={classes.title}>{testItem.testTitle}</Typography>
                    <Typography variant="subtitle1" className={classes.subtitle}>Class: {testItem.className}</Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h6" style={{ color: '#334155', fontWeight: 'bold' }}>
                      Score: {testItem.overallScore} / {testItem.totalPossibleMarks}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Time Spent: {(testItem.totalTimeSpent / 60).toFixed(1)} mins
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={4}>
                  
                  {/* Table Section */}
                  <Grid item xs={12} lg={8}>
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#475569' }}>Subject Breakdown</Typography>
                    
                    {/* Desktop Table */}
                    <div className={classes.desktopTable}>
                      <TableContainer component={Paper} className={classes.tableContainer}>
                        <Table size="small" aria-label="subject performance table">
                          <TableHead className={classes.tableHead}>
                            <TableRow>
                              <TableCell className={classes.tableHeadCell}>Subject</TableCell>
                              <TableCell className={classes.tableHeadCell} align="center">Zone</TableCell>
                              <TableCell className={classes.tableHeadCell} align="right">Score</TableCell>
                              <TableCell className={classes.tableHeadCell} align="center">Correct</TableCell>
                              <TableCell className={classes.tableHeadCell} align="center">Incorrect</TableCell>
                              <TableCell className={classes.tableHeadCell} align="center">Unattempted</TableCell>
                              <TableCell className={classes.tableHeadCell} align="right">Accuracy</TableCell>
                              <TableCell className={classes.tableHeadCell} align="right">Avg Time / Q</TableCell>
                              <TableCell className={classes.tableHeadCell} align="right">Avg Revisits</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.keys(testItem.subjects).map((subId) => {
                              const sub = testItem.subjects[subId];
                              if (sub.totalPossibleMarks > 0 && sub.obtainedMarks === sub.totalPossibleMarks) return null;

                              const easyCorrect = sub.difficultyStats?.EASY?.correct || 0;
                              const medCorrect = sub.difficultyStats?.MEDIUM?.correct || 0;
                              const hardCorrect = sub.difficultyStats?.HARD?.correct || 0;
                              const totalCorrect = (sub.correctCount !== undefined && sub.correctCount > 0) ? sub.correctCount : (easyCorrect + medCorrect + hardCorrect);

                              const easyAttempted = sub.difficultyStats?.EASY?.attempted || 0;
                              const medAttempted = sub.difficultyStats?.MEDIUM?.attempted || 0;
                              const hardAttempted = sub.difficultyStats?.HARD?.attempted || 0;
                              const totalAttempted = easyAttempted + medAttempted + hardAttempted;

                              const totalIncorrect = (sub.incorrectCount !== undefined && sub.incorrectCount > 0) ? sub.incorrectCount : Math.max(0, totalAttempted - totalCorrect);
                              const totalUnattempted = sub.unattemptedCount !== undefined ? sub.unattemptedCount : Math.max(0, (sub.questionCount || 0) - totalAttempted);

                              return (
                                <TableRow key={subId} hover>
                                  <TableCell component="th" scope="row" style={{ fontWeight: '600', color: '#0f172a' }}>
                                    {sub.subjectName}
                                  </TableCell>
                                  <TableCell align="center">{this.getZoneChip(sub.zone, classes)}</TableCell>
                                  <TableCell align="right">{sub.obtainedMarks} / {sub.totalPossibleMarks}</TableCell>
                                  <TableCell align="center" style={{ color: '#16a34a', fontWeight: 'bold' }}>{totalCorrect}</TableCell>
                                  <TableCell align="center" style={{ color: '#dc2626', fontWeight: 'bold' }}>{totalIncorrect}</TableCell>
                                  <TableCell align="center" style={{ color: '#64748b' }}>{totalUnattempted}</TableCell>
                                  <TableCell align="right">{(sub.accuracy * 100).toFixed(1)}%</TableCell>
                                  <TableCell align="right">{(sub.avgTimeSpent || 0).toFixed(1)}s</TableCell>
                                  <TableCell align="right">{(sub.avgRevisits || 0).toFixed(1)}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>

                    {/* Mobile Subject Cards */}
                    <div className={classes.mobileSubjectCards}>
                      {Object.keys(testItem.subjects).map((subId) => {
                        const sub = testItem.subjects[subId];
                        if (sub.totalPossibleMarks > 0 && sub.obtainedMarks === sub.totalPossibleMarks) return null;

                        const easyCorrect = sub.difficultyStats?.EASY?.correct || 0;
                        const medCorrect = sub.difficultyStats?.MEDIUM?.correct || 0;
                        const hardCorrect = sub.difficultyStats?.HARD?.correct || 0;
                        const totalCorrect = (sub.correctCount !== undefined && sub.correctCount > 0) ? sub.correctCount : (easyCorrect + medCorrect + hardCorrect);

                        const easyAttempted = sub.difficultyStats?.EASY?.attempted || 0;
                        const medAttempted = sub.difficultyStats?.MEDIUM?.attempted || 0;
                        const hardAttempted = sub.difficultyStats?.HARD?.attempted || 0;
                        const totalAttempted = easyAttempted + medAttempted + hardAttempted;

                        const totalIncorrect = (sub.incorrectCount !== undefined && sub.incorrectCount > 0) ? sub.incorrectCount : Math.max(0, totalAttempted - totalCorrect);
                        const totalUnattempted = sub.unattemptedCount !== undefined ? sub.unattemptedCount : Math.max(0, (sub.questionCount || 0) - totalAttempted);

                        return (
                          <div key={subId} className={classes.subjectCard}>
                            <div className={classes.subjectCardTitle}>
                              <span>{sub.subjectName}</span>
                              {this.getZoneChip(sub.zone, classes)}
                            </div>
                            <div className={classes.subjectCardRow}>
                              <span className={classes.subjectCardLabel}>Score</span>
                              <span className={classes.subjectCardValue}>{sub.obtainedMarks} / {sub.totalPossibleMarks}</span>
                            </div>
                            <div className={classes.subjectCardRow}>
                              <span className={classes.subjectCardLabel}>Accuracy</span>
                              <span className={classes.subjectCardValue}>{(sub.accuracy * 100).toFixed(1)}%</span>
                            </div>
                            <div className={classes.statsRow}>
                              <span className={classes.statBadge} style={{ backgroundColor: '#dcfce3', color: '#166534' }}>✓ {totalCorrect}</span>
                              <span className={classes.statBadge} style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>✗ {totalIncorrect}</span>
                              <span className={classes.statBadge} style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>— {totalUnattempted}</span>
                            </div>
                            <div className={classes.subjectCardRow} style={{ marginTop: '6px' }}>
                              <span className={classes.subjectCardLabel}>Avg Time / Q</span>
                              <span className={classes.subjectCardValue}>{(sub.avgTimeSpent || 0).toFixed(1)}s</span>
                            </div>
                            <div className={classes.subjectCardRow}>
                              <span className={classes.subjectCardLabel}>Avg Revisits</span>
                              <span className={classes.subjectCardValue}>{(sub.avgRevisits || 0).toFixed(1)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Grid>

                  {/* Overall Score Circle Chart Section */}
                  <Grid item xs={12} lg={4}>
                    <Card className={classes.chartCard}>
                      <CardContent className={classes.scoreCircle}>
                        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#475569', alignSelf: 'flex-start' }}>Overall Performance</Typography>
                        <div style={{ width: '100%', height: 220, position: 'relative' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                              cx="50%" cy="50%" 
                              innerRadius="70%" outerRadius="100%" 
                              barSize={20} data={radialData} 
                              startAngle={90} endAngle={-270}
                            >
                              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                              <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <Box style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <Typography variant="h4" style={{ fontWeight: '900', color: '#1e293b' }}>
                              {overallPercentage.toFixed(1)}%
                            </Typography>
                            <Typography variant="caption" color="textSecondary">Total Accuracy</Typography>
                          </Box>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Charts Section */}
                  <Grid item xs={12} md={6}>
                    <Card className={classes.chartCard}>
                      <CardContent>
                        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#475569', marginBottom: '16px' }}>Accuracy by Subject (%)</Typography>
                        <div className={classes.chartContainer}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={accuracyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="subject" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                              <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                              <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Bar dataKey="Accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card className={classes.chartCard}>
                      <CardContent>
                        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#475569', marginBottom: '16px' }}>Correct Answers by Difficulty</Typography>
                        <div className={classes.chartContainer}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={difficultyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="subject" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                              <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Legend wrapperStyle={{ paddingTop: '10px' }} />
                              <Bar dataKey="Easy Correct" stackId="a" fill={DIFFICULTY_COLORS.EASY} radius={[0, 0, 0, 0]} maxBarSize={50} />
                              <Bar dataKey="Med Correct" stackId="a" fill={DIFFICULTY_COLORS.MEDIUM} radius={[0, 0, 0, 0]} maxBarSize={50} />
                              <Bar dataKey="Hard Correct" stackId="a" fill={DIFFICULTY_COLORS.HARD} radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>

                  {testItem.questionTimeAnalytics && testItem.questionTimeAnalytics.length > 0 && (
                    <Grid item xs={12}>
                      <Card className={classes.chartCard}>
                        <CardContent>
                          <Typography variant="h6" style={{ fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>
                            Time Spent per Question Analysis
                          </Typography>
                          <Typography variant="body2" style={{ marginBottom: '20px', color: '#64748b' }}>
                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Weak (&gt;2 mins)</span> | 
                            <span style={{ color: '#f59e0b', fontWeight: 'bold', marginLeft: '8px' }}>Medium (1-2 mins)</span> | 
                            <span style={{ color: '#22c55e', fontWeight: 'bold', marginLeft: '8px' }}>Strong (&lt;1 min)</span>
                          </Typography>
                          <div className={classes.chartContainer} style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={testItem.questionTimeAnalytics} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <RechartsTooltip 
                                  cursor={{ fill: '#f1f5f9' }} 
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                  formatter={(value, name, props) => {
                                      let strength = "Strong";
                                      if (value > 120) strength = "Weak";
                                      else if (value > 60) strength = "Medium";
                                      return [`${value}s (${strength})`, 'Time Spent'];
                                  }}
                                />
                                <Bar dataKey="Time" radius={[4, 4, 0, 0]}>
                                  {testItem.questionTimeAnalytics.map((entry, index) => {
                                      let color = '#22c55e';
                                      if (entry.Time > 120) color = '#ef4444';
                                      else if (entry.Time > 60) color = '#f59e0b';
                                      return <Cell key={`cell-${index}`} fill={color} />;
                                  })}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                </Grid>
              </Paper>
            );
          })
        )}
      </Box>
    );
  }
}

export default withStyles(useStyles)(StudentDashboard);
