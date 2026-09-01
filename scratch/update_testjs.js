const fs = require('fs');
let code = fs.readFileSync('backend/services/test.js', 'utf8');

const replacement = `      if (answerMissing) {
        return res.status(400).json({ success: false, message: "A valid correct answer must be provided." });
      }

      let diffMarks = parseInt(marks) - question.marks;
      
      if (!question.optionImages || question.optionImages.length < 4) {
        question.optionImages = [
          question.optionImages?.[0] || '', 
          question.optionImages?.[1] || '', 
          question.optionImages?.[2] || '', 
          question.optionImages?.[3] || ''
        ];
      }

      // Check for image deletions
      if (req.body.delete_bodyImage === 'true' && question.bodyImage) {
        if (question.bodyImage.includes('res.cloudinary.com')) {
          await deleteFile(question.bodyImage);
        } else if (question.bodyImage.startsWith('/uploads/')) {
          const fs = require('fs');
          const path = require('path');
          const filePath = path.join(__dirname, '../public', question.bodyImage);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        question.bodyImage = '';
      }
      
      if (req.body.delete_explanationImage === 'true' && question.explanationImage) {
        if (question.explanationImage.includes('res.cloudinary.com')) {
          await deleteFile(question.explanationImage);
        } else if (question.explanationImage.startsWith('/uploads/')) {
          const fs = require('fs');
          const path = require('path');
          const filePath = path.join(__dirname, '../public', question.explanationImage);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        question.explanationImage = '';
      }

      for (let i = 1; i <= 4; i++) {
        if (req.body[\`delete_optImg\${i}\`] === 'true' && question.optionImages[i-1]) {
          if (question.optionImages[i-1].includes('res.cloudinary.com')) {
            await deleteFile(question.optionImages[i-1]);
          } else if (question.optionImages[i-1].startsWith('/uploads/')) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../public', question.optionImages[i-1]);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
          question.optionImages[i-1] = '';
        }
      }

      // Process uploaded images`;

code = code.replace(`      if (answerMissing) {
        return res.status(400).json({ success: false, message: "A valid correct answer must be provided." });
      }
  
      let diffMarks = parseInt(marks) - question.marks;
      
      if (!question.optionImages || question.optionImages.length < 4) {
        question.optionImages = [
          question.optionImages?.[0] || '', 
          question.optionImages?.[1] || '', 
          question.optionImages?.[2] || '', 
          question.optionImages?.[3] || ''
        ];
      }
  
      // Process uploaded images`, replacement);

fs.writeFileSync('backend/services/test.js', code);
