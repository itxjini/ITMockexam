const QUESTIONS = [
  {
    id: 1, section: "Hardware",
    q: "Which component is called the 'brain' of the computer?",
    opts: ["Hard Disk Drive", "Central Processing Unit (CPU)", "RAM", "Motherboard"],
    ans: 1
  },
  {
    id: 2, section: "Hardware",
    q: "RAM stands for:",
    opts: ["Read Access Memory", "Random Access Memory", "Rapid Array Memory", "Read All Memory"],
    ans: 1
  },
  {
    id: 3, section: "Hardware",
    q: "Which type of memory LOSES all its data when power is switched off?",
    opts: ["ROM", "SSD", "RAM", "Hard Disk Drive"],
    ans: 2
  },
  {
    id: 4, section: "Hardware",
    q: "Cache memory is located:",
    opts: ["On the hard disk", "Inside or very near the CPU", "In the monitor", "On the keyboard"],
    ans: 1
  },
  {
    id: 5, section: "Hardware",
    q: "Which of the following is a NON-VOLATILE storage device?",
    opts: ["RAM", "Cache Memory", "CPU Register", "Solid State Drive (SSD)"],
    ans: 3
  },
  {
    id: 6, section: "Hardware",
    q: "The motherboard is also known as the:",
    opts: ["CPU Board", "Display Board", "System Board (Mainboard)", "Memory Board"],
    ans: 2
  },
  {
    id: 7, section: "Hardware",
    q: "BIOS stands for:",
    opts: ["Basic Input Output System", "Binary Input Output Storage", "Boot Input Output Software", "Basic Integrated Output System"],
    ans: 0
  },
  {
    id: 8, section: "Hardware",
    q: "Which type of bus carries the ACTUAL DATA between computer components?",
    opts: ["Control Bus", "Address Bus", "Data Bus", "System Bus"],
    ans: 2
  },
  {
    id: 9, section: "Hardware",
    q: "Registers are the __________ memory in a computer system.",
    opts: ["Largest and slowest", "Fastest and smallest", "Most common type of", "Permanent non-volatile"],
    ans: 1
  },
  {
    id: 10, section: "Hardware",
    q: "The Address Bus is described as:",
    opts: ["Bidirectional — carries data both ways", "Unidirectional — CPU sends memory location", "Used only by RAM modules", "Part of the display system"],
    ans: 1
  },
  {
    id: 11, section: "Hardware",
    q: "Which level of Cache is the LARGEST in size but slowest among cache levels?",
    opts: ["L1 Cache", "L2 Cache", "L3 Cache", "L0 Cache"],
    ans: 2
  },
  {
    id: 12, section: "Hardware",
    q: "ROM (Read Only Memory) is characterized as:",
    opts: ["Volatile memory that loses data on shutdown", "Non-volatile memory that retains data permanently", "Secondary storage for large files", "An output device for display"],
    ans: 1
  },
  {
    id: 13, section: "Hardware",
    q: "EEPROM (Electrically Erasable Programmable ROM) can be erased using:",
    opts: ["Ultraviolet light", "Extreme heat", "Electrical signals", "Magnetic fields"],
    ans: 2
  },
  {
    id: 14, section: "Hardware",
    q: "Which port is commonly used to connect a monitor or TV for high-definition display output?",
    opts: ["USB Port", "Audio Jack", "HDMI Port", "Ethernet Port"],
    ans: 2
  },
  {
    id: 15, section: "Hardware",
    q: "In computer connectivity, a CONNECTOR refers to:",
    opts: ["A socket (opening) on the computer body", "The plug at the end of a cable", "A type of volatile RAM", "An internal CPU component"],
    ans: 1
  },
  {
    id: 16, section: "Hardware",
    q: "What is the PRIMARY function of BIOS when a computer powers on?",
    opts: ["Loads Microsoft Office applications", "Checks all hardware and loads the Operating System", "Establishes internet connection", "Encrypts and saves user files"],
    ans: 1
  },
  {
    id: 17, section: "Hardware",
    q: "Which component on the motherboard physically holds and connects the processor?",
    opts: ["SATA Port", "RAM Slot (DIMM)", "CPU Socket", "PCIe Expansion Slot"],
    ans: 2
  },
  {
    id: 18, section: "Hardware",
    q: "What is the correct order of the memory hierarchy from FASTEST to SLOWEST?",
    opts: [
      "RAM → Cache → Registers → HDD",
      "Registers → Cache → RAM → HDD/SSD",
      "HDD → RAM → Cache → Registers",
      "Cache → Registers → RAM → SSD"
    ],
    ans: 1
  },
  {
    id: 19, section: "Hardware",
    q: "An Operating System (OS) is responsible for managing:",
    opts: [
      "Only the CPU processing speed",
      "Only the file storage system",
      "Hardware, memory, files, devices, and the user interface",
      "Only the internet and network connection"
    ],
    ans: 2
  },
  {
    id: 20, section: "Hardware",
    q: "Which of the following is an example of a Multi-User Operating System?",
    opts: ["Windows 11 Home Edition", "Linux Server / Unix", "MS-DOS", "Android Mobile OS"],
    ans: 1
  },

  {
    id: 21, section: "MS Word",
    q: "Which Ribbon tab is used to insert a Header or Footer in Microsoft Word?",
    opts: ["Home Tab", "Layout Tab", "Insert Tab", "References Tab"],
    ans: 2
  },
  {
    id: 22, section: "MS Word",
    q: "The keyboard shortcut CTRL + H in MS Word is used to:",
    opts: ["Find specific text in a document", "Find and Replace text throughout the document", "Select all content (Ctrl+A)", "Save the document"],
    ans: 1
  },
  {
    id: 23, section: "MS Word",
    q: "To insert an automatic Table of Contents in MS Word, you navigate to:",
    opts: ["Insert Tab → Table", "Home Tab → Styles", "References Tab → Table of Contents", "View Tab → Navigation Pane"],
    ans: 2
  },
  {
    id: 24, section: "MS Word",
    q: "A Watermark in MS Word:",
    opts: [
      "Only appears on the final page of the document",
      "Appears as faded text/image in the background of every page",
      "Is placed inside a floating text box on one page",
      "Only becomes visible when the document is printed"
    ],
    ans: 1
  },
  {
    id: 25, section: "MS Word",
    q: "Pressing CTRL + Enter in MS Word inserts a:",
    opts: ["Section Break (Next Page)", "Page Break — forces text to a new page", "Column Break", "Paragraph Break only"],
    ans: 1
  },

  {
    id: 26, section: "MS Excel",
    q: "Which Excel feature automatically changes cell color or format based on rules you set?",
    opts: ["AutoFill feature", "Pivot Table", "Conditional Formatting", "Data Validation"],
    ans: 2
  },
  {
    id: 27, section: "MS Excel",
    q: "A Pivot Table in Microsoft Excel is primarily used to:",
    opts: [
      "Draw and customize charts and graphs",
      "Validate and restrict data entry in cells",
      "Summarize, analyze, and group large datasets quickly",
      "Insert and format images in spreadsheets"
    ],
    ans: 2
  },
  {
    id: 28, section: "MS Excel",
    q: "The AND function in Excel returns TRUE only when:",
    opts: [
      "Any single condition among all is true",
      "ALL specified conditions are true simultaneously",
      "No conditions are true",
      "At least one condition is false"
    ],
    ans: 1
  },
  {
    id: 29, section: "MS Excel",
    q: "Data Validation in Excel is mainly used to:",
    opts: [
      "Format numbers as currency or percentage",
      "Create drop-down lists and control what users can enter in cells",
      "Sort and filter data automatically",
      "Merge multiple cells together"
    ],
    ans: 1
  },
  {
    id: 30, section: "MS Excel",
    q: "The AutoFill feature in Excel can automatically continue:",
    opts: [
      "Only numeric sequences (1, 2, 3…)",
      "Only date sequences",
      "Numbers, dates, days, months, text+numbers, and formulas",
      "Only text patterns"
    ],
    ans: 2
  }
];


const WORD_TASKS = [
  { num: 1,  marks: 2, desc: "Apply <strong>Heading 1</strong> style to the main document title and <strong>Heading 2</strong> to each hardware topic sub-section (at least 4 sub-headings). Use the Styles group on the Home tab." },
  { num: 2,  marks: 3, desc: "Insert an <strong>Automatic Table of Contents</strong> at the very beginning of the document. (References tab → Table of Contents → Automatic Table 1)" },
  { num: 3,  marks: 3, desc: "Add a <strong>Header</strong> showing your document title on the left. Add a <strong>Footer</strong> with your Roll Number on the left and today's date on the right. (Insert tab → Header / Footer)" },
  { num: 4,  marks: 2, desc: "Insert a <strong>Watermark</strong> with the text <em>'DRAFT'</em> visible in the background of all pages. (Design tab → Watermark → DRAFT)" },
  { num: 5,  marks: 2, desc: "Change the <strong>Page Setup</strong>: Set Margins to <em>Narrow</em>, Orientation to <em>Portrait</em>, and Paper Size to <em>A4</em>. (Layout tab → Page Setup group)" },
  { num: 6,  marks: 1, desc: "Change the <strong>Page Color</strong> to a light color of your choice. (Design tab → Page Color)" },
  { num: 7,  marks: 2, desc: "Insert a <strong>Page Break</strong> before each hardware topic so every topic starts on a fresh page. (Ctrl + Enter OR Insert tab → Pages → Page Break)" },
  { num: 8,  marks: 2, desc: "Add at least <strong>ONE Footnote</strong> at the bottom of any page referencing a source or textbook. (References tab → Insert Footnote)" },
  { num: 9,  marks: 2, desc: "Use <strong>Find & Replace</strong> (Ctrl + H) to replace the word <em>'computer'</em> with <em>'Computer'</em> (capital C) throughout the entire document." },
  { num: 10, marks: 3, desc: "Insert a <strong>Table</strong> at the end of the document with 3 columns: <em>Component | Type | Description</em>. Fill in at least 5 hardware components with accurate descriptions." },
  { num: 11, marks: 1, desc: "Enable <strong>Hyphenation</strong> for the entire document. (Layout tab → Hyphenation → Automatic)" },
  { num: 12, marks: 2, desc: "Change the body text font to <strong>Times New Roman, Size 12</strong>. Apply <strong>Justify</strong> alignment to all body paragraphs (Ctrl + J)." },
  { num: 13, marks: 2, desc: "Insert a <strong>Section Break (Next Page)</strong> between the Table of Contents and the first hardware topic. (Insert → Breaks → Next Page Section Break)" },
  { num: 14, marks: 2, desc: "Insert a <strong>Shape</strong> (e.g., a rectangle) on any page to visually represent a hardware component. Add a text label inside the shape. (Insert tab → Shapes)" },
  { num: 15, marks: 2, desc: "Add a separate <strong>Endnote</strong> at the end of the document listing all references. (References tab → Insert Endnote)" },
  { num: 16, marks: 2, desc: "After completing all tasks, <strong>Update the Table of Contents</strong>: right-click the TOC → Update Field → Update entire table. Then save with Ctrl + S." },
];

const EXCEL_TASKS = [
  { num: 1,  marks: 2, desc: "Select cells <strong>A1:H1</strong> and use <strong>Merge & Center</strong>. Type the heading <em>'Student Results — Final Exam'</em>. Apply Bold, Font Size 14, and Blue font color." },
  { num: 2,  marks: 2, desc: "Use a <strong>SUM formula</strong> in column F to calculate Total marks (Math + English + Science + IT) for each student. E.g. <code>=SUM(B2:E2)</code>" },
  { num: 3,  marks: 2, desc: "Use an <strong>AVERAGE formula</strong> in column G to calculate the average marks per student. E.g. <code>=AVERAGE(B2:E2)</code>" },
  { num: 4,  marks: 3, desc: "Use a <strong>nested IF formula</strong> in column H for Grade: Average ≥ 85 → <em>'A'</em>, Average ≥ 70 → <em>'B'</em>, Average ≥ 55 → <em>'C'</em>, else → <em>'F'</em>." },
  { num: 5,  marks: 2, desc: "Apply <strong>Conditional Formatting</strong> on the Total column: highlight cells <strong>&gt; 320 in Green</strong> and cells <strong>&lt; 240 in Red</strong>. (Home tab → Conditional Formatting → Highlight Cell Rules)" },
  { num: 6,  marks: 2, desc: "Add <strong>Data Validation</strong> on the Grade column to create a Drop-Down list with options: A, B, C, F. (Data tab → Data Validation → Allow: List)" },
  { num: 7,  marks: 3, desc: "Create a <strong>Column Chart</strong> on a new sheet showing each student's Total marks. Add chart title: <em>'Student Total Marks'</em>. Label axes and customize bar colors." },
  { num: 8,  marks: 3, desc: "Create a <strong>Pivot Table</strong> on Sheet 3. Set Row = Student Name, Values = Average of Math, English, Science, and IT separately." },
  { num: 9,  marks: 1, desc: "<strong>Sort</strong> the data on Sheet 1 by Total marks in <strong>Descending order</strong>. (Data tab → Sort → Column F → Largest to Smallest)" },
  { num: 10, marks: 1, desc: "<strong>Freeze the top two rows</strong> so headers stay visible when scrolling. (View tab → Freeze Panes → Freeze Top Row)" },
  { num: 11, marks: 2, desc: "Format the <strong>Total column</strong> as Number with 0 decimal places. Format the <strong>Average column</strong> to show exactly 2 decimal places. (Home tab → Number Section)" },
  { num: 12, marks: 2, desc: "Use the <strong>AND function</strong> in column I titled <em>'Pass All?'</em>: return TRUE if the student scored above 55 in ALL four subjects." },
  { num: 13, marks: 2, desc: "Use the <strong>OR function</strong> in column J titled <em>'Top Subject?'</em>: return TRUE if the student scored above 90 in ANY one subject." },
  { num: 14, marks: 2, desc: "Apply <strong>Wrap Text and Center alignment</strong> to all header cells. Apply <strong>All Borders</strong> to the entire data table." },
  { num: 15, marks: 3, desc: "Add a new sheet named <em>'Summary'</em>. Display: <strong>Highest Total</strong> (MAX), <strong>Lowest Total</strong> (MIN), and <strong>Class Average</strong> (AVERAGE) referencing Sheet 1 data." },
  { num: 16, marks: 1, desc: "<strong>Protect Sheet 1</strong> with the password <em>'IT2024'</em> so no edits can be made without the password. (Review tab → Protect Sheet)" },
];
