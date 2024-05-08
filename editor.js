// Get content editable div
const editor = document.getElementById('editor');
// Get heading format select element
const headingFormatSelect = document.getElementById('headingFormat');
// Get font size select element
const fontSizeSelect = document.getElementById('fontSize');
// Get insert link button and modal elements
const insertLinkBtn = document.getElementById('insertLinkBtn');
const linkURLInput = document.getElementById('linkURL');
const linkTextInput = document.getElementById('linkText');
const insertLinkModal = new bootstrap.Modal(document.getElementById('insertLinkModal'));


const insertImageBtn = document.getElementById('insertImageBtn');
const imageFileInput = document.getElementById('imageFile');
const insertImageModal = new bootstrap.Modal(document.getElementById('insertImageModal'));


// Add event listener for paste event
editor.addEventListener('paste', event => {
    // Prevent the default paste behavior
    event.preventDefault();
  
    // Get the plain text version of the pasted content
    const text = (event.clipboardData || window.clipboardData).getData('text/plain');
  
    // Insert the plain text into the editor
    document.execCommand('insertText', false, text);
  });

// Add event listener for toolbar buttons
document.querySelectorAll('[data-command]').forEach(item => {
  item.addEventListener('click', event => {
    const command = item.getAttribute('data-command');
    const value = item.getAttribute('data-value') || null; // Retrieve the value if present

    if (value) {
      // For formatBlock command, set the value as the tag name
      document.execCommand(command, false, value);
    } else {
      // Execute command without value
      document.execCommand(command, false, null);
    }

    // Focus on the editor after command execution
    editor.focus();
  });
});

function insertHorizontalLine() {
    // Get the current selection range
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      // Create a new paragraph element to contain the horizontal line
      const paragraph = document.createElement('p');
      // Create a horizontal line element
      const hrElement = document.createElement('hr');
      // Insert the horizontal line into the paragraph
      paragraph.appendChild(hrElement);
      // Insert the paragraph with the horizontal line at the current selection range
      range.insertNode(paragraph);
    }
  }
  
  // Add event listener for inserting horizontal line button click
  document.getElementById('insertHorizontalLineBtn').addEventListener('click', event => {
    insertHorizontalLine();
  });

// Add event listener for heading format select change
headingFormatSelect.addEventListener('change', event => {
  const selectedHeading = headingFormatSelect.value;
  document.execCommand('formatBlock', false, selectedHeading);
  // Focus on the editor after command execution
  editor.focus();
});

// Add event listener for font size select change
fontSizeSelect.addEventListener('change', event => {
  const selectedFontSize = fontSizeSelect.value;
  document.execCommand('fontSize', false, selectedFontSize);
  // Focus on the editor after command execution
  editor.focus();
});

// Add event listener for insert link button click
insertLinkBtn.addEventListener('click', event => {
    const url = linkURLInput.value.trim();
    const text = linkTextInput.value.trim();
  
    if (url !== '' && text !== '') {
      // Hide the modal first
      insertLinkModal.hide();
  
      // Create link element
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.textContent = text;
      linkElement.target = '_blank';
  
      // If editor is empty, append link at the start
      if (editor.textContent.trim() === '') {
        editor.appendChild(linkElement);
      } else {
        // Otherwise, append link at the end
        editor.appendChild(document.createTextNode(' '));
        editor.appendChild(linkElement);
      }
  
      // Clear input fields
      linkURLInput.value = '';
      linkTextInput.value = '';
    } else {
      // Show alert or handle empty input fields
      alert('Please enter both URL and link text.');
    }
  });
  

  // Add event listener for insert image button click
insertImageBtn.addEventListener('click', event => {
    // Open the modal
    insertImageModal.show();
  });
  
 // Function to handle image removal
function removeImage(imgElement) {
    imgElement.parentNode.removeChild(imgElement);
  }
  
  // Function to handle image resizing
  function resizeImage(imgElement) {
    imgElement.style.width = '100%'; // Set initial width to 100% for responsiveness
  
    // Create close button
    const closeButton = document.createElement('span');
    closeButton.innerHTML = 'X';
    closeButton.classList.add('close-button');
    // Add event listener for close button click
    closeButton.addEventListener('click', function(event) {
      event.stopPropagation(); // Prevent event bubbling
      removeImage(imgElement);
    });
    // Append close button to image
    imgElement.appendChild(closeButton);
  
    // Add event listener for mouse down on the image
    imgElement.addEventListener('mousedown', function(event) {
      event.preventDefault();
      // Get initial mouse position
      const initialX = event.clientX;
      const initialY = event.clientY;
      const initialWidth = imgElement.offsetWidth;
      const initialHeight = imgElement.offsetHeight;
  
      // Add event listener for mouse move
      document.addEventListener('mousemove', resize);
  
      // Add event listener for mouse up
      document.addEventListener('mouseup', function() {
        document.removeEventListener('mousemove', resize);
      });
  
      // Function to handle resizing on mouse move
      function resize(event) {
        const width = initialWidth + (event.clientX - initialX);
        const height = initialHeight + (event.clientY - initialY);
        imgElement.style.width = width + 'px';
        imgElement.style.height = height + 'px';
      }
    });
  }
  
  // Add event listener for insert image button click inside the modal
  document.getElementById('insertImageBtn').addEventListener('click', event => {
    const file = imageFileInput.files[0];
    if (file) {
      // Create a FileReader to read the file
      const reader = new FileReader();
      reader.onload = function(event) {
        // Create an image element
        const imgElement = document.createElement('img');
        imgElement.src = event.target.result;
        imgElement.classList.add('resizable'); // Add resizable class for styling
        // Call resizeImage function to enable resizing and add close button
        resizeImage(imgElement);
  
        // If editor is empty, append image at the start
        if (editor.textContent.trim() === '') {
          editor.appendChild(imgElement);
        } else {
          // Otherwise, append image at the end
          editor.appendChild(document.createElement('br')); // Add line break for separation
          editor.appendChild(imgElement);
        }
  
        // Clear input fields and close modal
        imageFileInput.value = '';
        insertImageModal.hide();
      };
      // Read the file as data URL
      reader.readAsDataURL(file);
    } else {
      // Show alert or handle empty input fields
      alert('Please select an image file.');
    }
  });
  