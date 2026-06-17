const output = document.getElementById('output');
const keyboard = document.getElementById('keyboard');

let capsLock = false;
let shift = false;

const rows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space']
];

function insertText(text) {
  const start = output.selectionStart;
  const end = output.selectionEnd;
  output.value = output.value.slice(0, start) + text + output.value.slice(end);
  output.focus();
  output.setSelectionRange(start + text.length, start + text.length);
}

function deleteChar() {
  const start = output.selectionStart;
  const end = output.selectionEnd;

  if (start === end && start > 0) {
    output.value = output.value.slice(0, start - 1) + output.value.slice(end);
    output.setSelectionRange(start - 1, start - 1);
  } else {
    output.value = output.value.slice(0, start) + output.value.slice(end);
    output.setSelectionRange(start, start);
  }

  output.focus();
}

function updateButtonStates() {
  document.querySelectorAll('.key').forEach((button) => {
    button.classList.remove('active');
  });

  if (capsLock) {
    const capsButton = document.querySelector('.key[data-value="Caps"]');
    if (capsButton) capsButton.classList.add('active');
  }

  if (shift) {
    const shiftButtons = document.querySelectorAll('.key[data-value="Shift"]');
    shiftButtons.forEach((btn) => btn.classList.add('active'));
  }
}

function handleKey(value) {
  if (value === 'Backspace') {
    deleteChar();
    return;
  }

  if (value === 'Tab') {
    insertText('    ');
    return;
  }

  if (value === 'Enter') {
    insertText('\n');
    return;
  }

  if (value === 'Space') {
    insertText(' ');
    return;
  }

  if (value === 'Caps') {
    capsLock = !capsLock;
    updateButtonStates();
    return;
  }

  if (value === 'Shift') {
    shift = !shift;
    updateButtonStates();
    return;
  }

  let text = value;

  if (shift || capsLock) {
    text = text.toUpperCase();
  } else {
    text = text.toLowerCase();
  }

  insertText(text);
}

rows.forEach((row) => {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row';

  row.forEach((key) => {
    const button = document.createElement('button');
    button.className = 'key';
    button.dataset.value = key;

    if (key === 'Backspace' || key === 'Caps' || key === 'Enter' || key === 'Shift') {
      button.classList.add('wide');
    }

    if (key === 'Space') {
      button.classList.add('space');
    }

    button.textContent = key;
    button.addEventListener('click', () => handleKey(key));
    rowDiv.appendChild(button);
  });

  keyboard.appendChild(rowDiv);
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key === 'CapsLock') {
    capsLock = !capsLock;
    updateButtonStates();
    return;
  }

  if (key === 'Shift') {
    shift = true;
    updateButtonStates();
    return;
  }

  if (key === 'Backspace') {
    event.preventDefault();
    deleteChar();
    return;
  }

  if (key === 'Enter') {
    event.preventDefault();
    insertText('\n');
    return;
  }

  if (key === 'Tab') {
    event.preventDefault();
    insertText('    ');
    return;
  }

  if (key === ' ') {
    event.preventDefault();
    insertText(' ');
    return;
  }

  if (key.length === 1) {
    event.preventDefault();
    const letter = key;
    const finalChar = (shift || capsLock) ? letter.toUpperCase() : letter.toLowerCase();
    insertText(finalChar);
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'Shift') {
    shift = false;
    updateButtonStates();
  }
});
