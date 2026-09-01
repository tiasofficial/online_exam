const fs = require('fs');
let code = fs.readFileSync('user-portal-frontend/src/components/templates/PaperPreview/PaperPreview.js', 'utf8');

// Add CircularProgress import if missing
if (!code.includes('CircularProgress')) {
    code = code.replace(
        'DialogActions, IconButton',
        'DialogActions, IconButton, CircularProgress'
    );
    // fallback if IconButton wasn't there
    code = code.replace(
        'Modal, TextField, FormControl, InputLabel, Select, MenuItem, Box, Checkbox, ListItemText',
        'Modal, TextField, FormControl, InputLabel, Select, MenuItem, Box, Checkbox, ListItemText, CircularProgress, IconButton'
    );
}
if (!code.includes('CloseIcon')) {
    code = code.replace(
        'import axios from \'axios\';',
        'import CloseIcon from \'@material-ui/icons/Close\';\nimport axios from \'axios\';'
    );
}

// Add submitting state
code = code.replace(
    'editingQuestion: null, // Holds the question currently being edited',
    'editingQuestion: null, // Holds the question currently being edited\n      submitting: false,'
);

// Add submitting = true on submit
code = code.replace(
    'const formData = new FormData();',
    'this.setState({ submitting: true });\n      const formData = new FormData();'
);
code = code.replace(
    'if (this.state.editData.delete_bodyImage) formData.append(\'delete_bodyImage\', \'true\');',
    ''
); // ensure clean

// Add backend form data for deletion
code = code.replace(
    'if (this.state.editData.bodyImage) formData.append(\'bodyImage\', this.state.editData.bodyImage);',
    'if (this.state.editData.bodyImage) formData.append(\'bodyImage\', this.state.editData.bodyImage);\n      if (this.state.editData.delete_bodyImage) formData.append(\'delete_bodyImage\', \'true\');\n      if (this.state.editData.delete_explanationImage) formData.append(\'delete_explanationImage\', \'true\');\n      if (this.state.editData.delete_optImg1) formData.append(\'delete_optImg1\', \'true\');\n      if (this.state.editData.delete_optImg2) formData.append(\'delete_optImg2\', \'true\');\n      if (this.state.editData.delete_optImg3) formData.append(\'delete_optImg3\', \'true\');\n      if (this.state.editData.delete_optImg4) formData.append(\'delete_optImg4\', \'true\');'
);

// Add submitting = false in finally or after requests
code = code.replace(
    'this.handleCloseModal();\n        this.fetchTestDetails();\n      } catch (err) {\n        console.log(err);\n      }',
    'this.handleCloseModal();\n        this.fetchTestDetails();\n      } catch (err) {\n        console.log(err);\n      } finally {\n        this.setState({ submitting: false });\n      }'
);

// Replace Save button
code = code.replace(
    '<Button type="submit" variant="contained" color="primary">Save Changes</Button>',
    '<Button type="submit" variant="contained" color="primary" disabled={this.state.submitting}>\n                      {this.state.submitting ? <CircularProgress size={24} color="inherit" /> : \'Save Changes\'}\n                    </Button>'
);

// Add renderImageField method
const renderMethod = `
  renderImageField = (name, label, existingImageUrl, deleteStateKey) => {
    const isDeleted = this.state.editData[deleteStateKey];
    const newFile = this.state.editData[name];

    return (
      <div style={{ marginTop: '15px' }}>
        <Typography variant="body2">{label}:</Typography>
        
        {existingImageUrl && !isDeleted && !newFile && (
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
            <img src={getImageUrl(existingImageUrl)} alt={label} style={{ maxHeight: '100px', display: 'block', borderRadius: '4px' }} />
            <IconButton 
              size="small" 
              onClick={() => this.setState({ editData: { ...this.state.editData, [deleteStateKey]: true } })} 
              style={{ position: 'absolute', top: -10, right: -10, backgroundColor: '#fff', boxShadow: '0 0 5px rgba(0,0,0,0.3)', color: '#d32f2f' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        )}

        {existingImageUrl && isDeleted && !newFile && (
          <Typography variant="caption" style={{ color: '#d32f2f', display: 'block', marginBottom: '10px' }}>Existing image will be deleted.</Typography>
        )}

        <div style={{
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
          <input type="file" name={name} accept="image/*" onChange={this.handleFileChange} />
          {newFile && (
            <div style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e8f5e9', padding: '4px 8px', borderRadius: '4px' }}>
              <span>📷 New image attached: {newFile.name}</span>
              <IconButton size="small" onClick={() => this.setState({ editData: { ...this.state.editData, [name]: null } })} style={{ color: '#d32f2f' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    );
  }

  handleEditSubmit`;

code = code.replace('  handleEditSubmit', renderMethod);

// Replace file inputs with renderImageField calls
code = code.replace(
    '<div className={classes.fileInputContainer}>\n                    <Typography variant="body2">Replace Image:</Typography>\n                    <input type="file" name="bodyImage" accept="image/*" onChange={this.handleFileChange} />\n                    {editingQuestion.bodyImage && <Typography variant="caption" color="secondary">(Current image will be replaced if new one is selected)</Typography>}\n                  </div>',
    '{this.renderImageField(\'bodyImage\', \'Question Image\', editingQuestion.bodyImage, \'delete_bodyImage\')}'
);

code = code.replace(
    '<div className={classes.fileInputContainer} style={{ marginBottom: \'10px\' }}>\n                        <Typography variant="body2">Replace Image:</Typography>\n                        <input type="file" name={`optImg${num}`} accept="image/*" onChange={this.handleFileChange} />\n                      </div>',
    '{this.renderImageField(`optImg${num}`, `Option ${num} Image`, editingQuestion.optionImages ? editingQuestion.optionImages[num-1] : null, `delete_optImg${num}`)}'
);

code = code.replace(
    '<div style={{ marginTop: \'15px\' }}>\n                    <Typography variant="body2">Explanation Image:</Typography>\n                    {this.state.editData.explanationImage && typeof this.state.editData.explanationImage === \'string\' && (\n                      <img src={this.state.editData.explanationImage.startsWith(\'http\') ? this.state.editData.explanationImage : apis.BASE + this.state.editData.explanationImage} alt="explanation" style={{ maxHeight: \'60px\', display: \'block\', marginBottom: \'5px\' }} />\n                    )}\n                    <input type="file" name="explanationImage" accept="image/*" onChange={this.handleFileChange} />\n                  </div>',
    '{this.renderImageField(\'explanationImage\', \'Explanation Image\', editingQuestion.explanationImage, \'delete_explanationImage\')}'
);


fs.writeFileSync('user-portal-frontend/src/components/templates/PaperPreview/PaperPreview.js', code);
