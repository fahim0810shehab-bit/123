
import Papa from 'papaparse';

// NSU Course Catalog - Complete list of all valid NSU courses
export const NSU_COURSES = new Set([
    // Accounting (ACT)
    'ACT201', 'ACT202', 'ACT310', 'ACT320', 'ACT360', 'ACT370', 'ACT380', 'ACT410', 'ACT430',
    
    // Applied Mathematics & Computer Science (AMCS)
    'AMCS502', 'AMCS504', 'AMCS505',
    
    // Anthropology (ANT)
    'ANT101',
    
    // Architecture (ARC)
    'ARC111', 'ARC112', 'ARC121', 'ARC122', 'ARC123', 'ARC131', 'ARC133', 'ARC200',
    'ARC213', 'ARC214', 'ARC215', 'ARC241', 'ARC242', 'ARC251', 'ARC261', 'ARC262',
    'ARC263', 'ARC264', 'ARC271', 'ARC272', 'ARC273', 'ARC281', 'ARC282', 'ARC283',
    'ARC293', 'ARC310', 'ARC316', 'ARC317', 'ARC318', 'ARC324', 'ARC334', 'ARC343',
    'ARC344', 'ARC384', 'ARC410', 'ARC419', 'ARC437', 'ARC438', 'ARC445', 'ARC453',
    'ARC455', 'ARC474', 'ARC492', 'ARC510', 'ARC576', 'ARC598',
    
    // Biochemistry and Biotechnology (BBT)
    'BBT203', 'BBT221', 'BBT230', 'BBT312', 'BBT312L', 'BBT314', 'BBT314L', 'BBT315',
    'BBT316', 'BBT316L', 'BBT317', 'BBT318', 'BBT335', 'BBT413', 'BBT413L', 'BBT415',
    'BBT415L', 'BBT416', 'BBT417', 'BBT419', 'BBT421', 'BBT423', 'BBT424', 'BBT425',
    'BBT427', 'BBT601', 'BBT608', 'BBT609', 'BBT615', 'BBT616', 'BBT622', 'BBT623',
    'BBT631', 'BBT638', 'BBT639', 'BBT654', 'BBT671', 'BBT685',
    
    // Languages (BEN, CHN, ENG)
    'BEN205', 'CHN101', 'CHN201', 'ENG101', 'ENG102', 'ENG103', 'ENG466', 'ENG481', 'ENG501',
    'ENG511', 'ENG522', 'ENG525', 'ENG552', 'ENG555', 'ENG557', 'ENG570', 'ENG573',
    'ENG574', 'ENG576', 'ENG581', 'ENG602', 'ENG111', 'ENG105',
    
    // Biology (BIO)
    'BIO103', 'BIO103L', 'BIO201', 'BIO201L', 'BIO202', 'BIO202L',
    
    // Basic Sciences (BSC, CHE)
    'BSC201', 'CHE101', 'CHE101L', 'CHE201', 'CHE202', 'CHE202L', 'CHE203', 'CHE203L',
    
    // Mathematics (MAT)
    'MAT116',
    
    // Statistics (STA)
    'STA101', 'STA102',
    
    // Business & Management (BUS)
    'BUS112', 'BUS135', 'BUS172', 'BUS173', 'BUS251', 'BUS498', 'BUS500', 'BUS501', 'BUS505',
    'BUS511', 'BUS516', 'BUS518', 'BUS520', 'BUS525', 'BUS530', 'BUS535', 'BUS601',
    'BUS620', 'BUS635', 'BUS650', 'BUS685', 'BUS690', 'BUS700',
    
    // Executive MBA (EMB)
    'EMB500', 'EMB501', 'EMB502', 'EMB510', 'EMB520', 'EMB601', 'EMB602', 'EMB620',
    'EMB650', 'EMB660', 'EMB670', 'EMB690',
    
    // Finance (FIN)
    'FIN254', 'FIN440', 'FIN444', 'FIN455', 'FIN464',
    
    // Human Resource Management (HRM)
    'HRM603', 'HRM604', 'HRM610', 'HRM631', 'HRM660',
    
    // International Business (INB)
    'INB350', 'INB372', 'INB400', 'INB410', 'INB480', 'INB490',
    
    // Civil and Environmental Engineering (CEE)
    'CEE100', 'CEE110', 'CEE209', 'CEE210', 'CEE211', 'CEE211L', 'CEE212', 'CEE212L',
    'CEE213', 'CEE214', 'CEE214L', 'CEE215', 'CEE240', 'CEE240L', 'CEE250', 'CEE250L',
    'CEE260', 'CEE271L', 'CEE310', 'CEE330', 'CEE331', 'CEE335', 'CEE340', 'CEE350',
    'CEE360', 'CEE360L', 'CEE370', 'CEE371L', 'CEE373', 'CEE373L', 'CEE415', 'CEE430',
    'CEE431', 'CEE435', 'CEE460', 'CEE470', 'CEE475',
    
    // Computer Science and Engineering (CSE)
    'CSE115', 'CSE115L', 'CSE173', 'CSE215', 'CSE215L', 'CSE225', 'CSE225L', 'CSE231',
    'CSE231L', 'CSE273', 'CSE299', 'CSE311', 'CSE311L', 'CSE323', 'CSE325', 'CSE327',
    'CSE331', 'CSE331L', 'CSE332', 'CSE332L', 'CSE338', 'CSE338L', 'CSE373', 'CSE411',
    'CSE413', 'CSE413L', 'CSE425', 'CSE435', 'CSE435L', 'CSE438', 'CSE438L', 'CSE440',
    'CSE445', 'CSE465', 'CSE482', 'CSE482L', 'CSE491', 'CSE495A', 'CSE495B', 'CSE499A',
    'CSE499B', 'CSE562', 'CSE564',
    
    // Development Studies (DEV)
    'DEV564', 'DEV565', 'DEV569',
    
    // Economics (ECO)
    'ECO101', 'ECO103', 'ECO104', 'ECO135', 'ECO172', 'ECO173', 'ECO201', 'ECO202', 'ECO204',
    'ECO245', 'ECO301', 'ECO302', 'ECO304', 'ECO317', 'ECO328', 'ECO348', 'ECO354', 'ECO372',
    'ECO380', 'ECO406', 'ECO414', 'ECO415', 'ECO472', 'ECO490', 'ECO501', 'ECO504',
    'ECO511', 'ECO613', 'ECO650', 'ECO682', 'ECO687',
    
    // Electrical and Electronic Engineering (EEE)
    'EEE111', 'EEE111L', 'EEE141', 'EEE141L', 'EEE154', 'EEE211', 'EEE211L', 'EEE221', 'EEE221L', 'EEE241',
    'EEE241L', 'EEE299', 'EEE311', 'EEE311L', 'EEE312', 'EEE312L', 'EEE321', 'EEE321L',
    'EEE331', 'EEE331L', 'EEE336L', 'EEE342', 'EEE342L', 'EEE361', 'EEE362', 'EEE362L',
    'EEE453L', 'EEE461', 'EEE462', 'EEE464', 'EEE465', 'EEE494', 'EEE499A', 'EEE499B',
    'EEE551',
    
    // Environmental Science & Management (ENV)
    'ENV203', 'ENV204', 'ENV205', 'ENV207', 'ENV209', 'ENV214', 'ENV215', 'ENV260',
    'ENV311', 'ENV315', 'ENV316', 'ENV373', 'ENV405', 'ENV409', 'ENV421', 'ENV436',
    'ENV455', 'ENV501', 'ENV502', 'ENV602', 'ENV606', 'ENV609', 'ENV627', 'ENV632',
    'ENV635', 'ENV649', 'ENV652',
    
    // Electronics and Telecommunication Engineering (ETE)
    'ETE111', 'ETE211L', 'ETE221', 'ETE241', 'ETE241L', 'ETE299', 'ETE311', 'ETE311L',
    'ETE312', 'ETE312L', 'ETE321', 'ETE321L', 'ETE331', 'ETE331L', 'ETE332', 'ETE332L',
    'ETE333', 'ETE334', 'ETE334L', 'ETE335', 'ETE335L', 'ETE499B',
    
    // Public Policy and Public Health (EMPG, EMPH)
    'EMPG500', 'EMPG510', 'EMPG530', 'EMPG555', 'EMPG570', 'EMPH601', 'EMPH609', 'EMPH611',
    'EMPH631', 'EMPH642', 'EMPH644', 'EMPH653', 'EMPH663', 'EMPH671', 'EMPH672', 'EMPH678',
    'EMPH681', 'EMPH704', 'EMPH706', 'EMPH711', 'EMPH712', 'EMPH713', 'EMPH742', 'EMPH745',
    'EMPH771', 'EMPH781', 'EMPH842',
    
    // Law (LAW)
    'LAW101', 'LAW200',
    
    // Other Disciplines (ETH, LBA)
    'ETH201', 'LBA104',
    
    // CSE Additional courses from original list
    'CSE199', 'CSE399', 'CSE422', 'CSE423', 'CSE427', 'CSE428', 'CSE450', 'CSE455',
    'CSE460', 'CSE498R',
    
    // Mathematics additional
    'MAT112', 'MAT120', 'MAT130', 'MAT250', 'MAT260', 'MAT350', 'MAT361', 'MAT370',
    
    // Physics
    'PHY107', 'PHY107L', 'PHY108', 'PHY108L', 'PHY201',
    
    // BBA Core
    'MIS107', 'MIS207', 'MGT212', 'MGT351', 'MGT314', 'MGT368', 'MGT489', 'MKT202',
    
    // BBA Majors
    'MKT337', 'MKT344', 'MKT460', 'MKT470',
    'FIN433', 'FIN435',
    'MIS210', 'MIS310', 'MIS320', 'MIS470',
    'HRM340', 'HRM360', 'HRM380', 'HRM450',
    'SCM310', 'SCM320', 'SCM450', 'MGT460',
    
    // Additional courses
    'SC0101', 'PHI101', 'PHI104', 'HIS102', 'HIS103', 'SOC101', 'GEO205', 'POL101',
]);

// Prerequisite Map
const PREREQUISITES: Record<string, string[]> = {
    'CSE215': ['CSE115'],
    'CSE225': ['CSE215'],
    'CSE311': ['CSE225', 'MAT120'],
    'CSE323': ['CSE225'],
    'CSE327': ['CSE225', 'MAT361'],
    'CSE331': ['CSE225', 'MAT361'],
    'CSE332': ['CSE225'],
    'CSE373': ['CSE225'],
    'CSE499A': ['CSE332', 'CSE323', 'CSE327'],
    'EEE141': ['MAT120'],
    'EEE111': ['PHY107'],
    'MAT120': ['MAT116'],
    'MAT130': ['MAT120'],
    'MAT250': ['MAT130'],
    'MAT350': ['MAT250'],
    'MAT361': ['MAT120']
};

export function validateNsuCourse(courseCode: string): boolean {
    // Normalize: Remove spaces, uppercase
    const normalized = courseCode.replace(/\s+/g, '').toUpperCase();
    
    if (NSU_COURSES.has(normalized)) {
        return true;
    }
    const baseCode = normalized.endsWith('L') ? normalized.slice(0, -1) : normalized;
    if (NSU_COURSES.has(baseCode)) {
        return true;
    }
    return false;
}

export function getGradeStatus(grade: string): { earnsCredit: boolean; isValid: boolean; description: string } {
    if (!grade || grade.trim() === '') {
        return { earnsCredit: false, isValid: false, description: "Blank/Missing Grade - No credit" };
    }
    
    const gradeUpper = grade.trim().toUpperCase();
    
    // Valid passing grades (earn credit)
    const passingGrades = new Set(['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D']);
    
    // Valid non-passing grades (no credit)
    const failingGrades = new Set(['F']);
    const nonCreditGrades = new Set(['W', 'I', 'AU']); // Withdrawal, Incomplete, Audit
    
    if (passingGrades.has(gradeUpper)) {
        return { earnsCredit: true, isValid: true, description: `${gradeUpper} - Passing Grade (Earns Credit)` };
    } else if (failingGrades.has(gradeUpper)) {
        return { earnsCredit: false, isValid: true, description: `${gradeUpper} - Failure (No Credit)` };
    } else if (nonCreditGrades.has(gradeUpper)) {
        return { earnsCredit: false, isValid: true, description: `${gradeUpper} - No Credit Awarded` };
    } else {
        return { earnsCredit: false, isValid: false, description: `${gradeUpper} - Invalid Grade (No Credit)` };
    }
}

interface CourseInfo {
    row: number;
    courseCode: string;
    courseTitle: string;
    credits: number;
    grade: string;
    semester: string;
    year: string;
    attempt: number;
    earnsCredit: boolean;
    status: string;
    category: 'PASSED' | 'FAILED' | 'WITHDRAWN' | 'INCOMPLETE' | 'AUDIT' | 'INVALID' | 'UNKNOWN';
}

interface StudentInfo {
    name: string;
    id: string;
    dob: string;
    program: string;
    datesOfAttendance: string;
    dateAwarded: string;
}

interface AuditResults {
    studentInfo: StudentInfo;
    totalCourses: number;
    validCredits: number;
    failedCredits: number;
    withdrawnCredits: number;
    incompleteCredits: number;
    auditCredits: number;
    zeroCreditCourses: number;
    invalidEntries: number;
    invalidCourses: Array<{ row: number; code: string; title: string; credits: number; grade: string }>;
    courseDetails: CourseInfo[];
    errors: string[];
}

function parseTranscriptCsv(csvContent: string): { studentInfo: StudentInfo, courses: Record<string, string>[] } {
    const lines = csvContent.split('\n');
    const studentInfo: StudentInfo = {
        name: 'Unknown',
        id: 'N/A',
        dob: 'N/A',
        program: 'Unknown',
        datesOfAttendance: 'N/A',
        dateAwarded: 'N/A'
    };
    
    // Find where the actual table starts
    let tableStartIdx = -1;
    
    for (let i = 0; i < Math.min(lines.length, 30); i++) {
        const line = lines[i].toLowerCase();
        // Look for common table headers
        if (line.includes('course') && (line.includes('grade') || line.includes('credit'))) {
            tableStartIdx = i;
            break;
        }
        
        // Extract metadata
        const lineStr = lines[i].trim().replace(/^"|"$/g, '');
        const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        
        let key = '';
        let val = '';
        
        if (parts.length >= 2 && parts[1]) {
            key = parts[0].toLowerCase();
            val = parts[1];
        } else if (lineStr.includes(':')) {
            const colonParts = lineStr.split(':');
            if (colonParts.length >= 2) {
                key = colonParts[0].toLowerCase();
                val = colonParts.slice(1).join(':').trim();
            }
        }
        
        if (val) {
            if (key.includes('name')) studentInfo.name = val;
            else if (key.includes('id')) studentInfo.id = val;
            else if (key.includes('dob') || key.includes('birth')) studentInfo.dob = val;
            else if (key.includes('program') || key.includes('major') || key.includes('degree')) studentInfo.program = val;
            else if (key.includes('attendance') || key.includes('dates')) studentInfo.datesOfAttendance = val;
            else if (key.includes('awarded') || key.includes('graduation')) studentInfo.dateAwarded = val;
        }
    }
    
    let coursesCsv = csvContent;
    if (tableStartIdx > 0) {
        coursesCsv = lines.slice(tableStartIdx).join('\n');
    }
    
    const parsed = Papa.parse(coursesCsv, { header: true, skipEmptyLines: true });
    
    return {
        studentInfo,
        courses: parsed.data as Record<string, string>[]
    };
}

function getFieldValue(row: Record<string, string>, possibleNames: string[], defaultValue: string = ''): string {
    let result = defaultValue;
    
    // Normalize row keys to lower case and remove spaces/underscores for comparison
    const normalizedRow: Record<string, string> = {};
    Object.keys(row).forEach(key => {
        const normalizedKey = key.toLowerCase().replace(/[\s_]/g, '');
        normalizedRow[normalizedKey] = row[key];
    });

    for (const name of possibleNames) {
        const lowerName = name.toLowerCase().replace(/[\s_]/g, '');
        if (normalizedRow[lowerName] !== undefined && normalizedRow[lowerName] !== '') {
            result = normalizedRow[lowerName];
            break;
        }
    }
    return result;
}

export function performLevel1Audit(csvContent: string): { report: string, data: any } {
    const { studentInfo, courses } = parseTranscriptCsv(csvContent);
    
    const results: AuditResults = {
        studentInfo,
        totalCourses: 0,
        validCredits: 0.0,
        failedCredits: 0.0,
        withdrawnCredits: 0.0,
        incompleteCredits: 0.0,
        auditCredits: 0.0,
        zeroCreditCourses: 0,
        invalidEntries: 0,
        invalidCourses: [],
        courseDetails: [],
        errors: []
    };

    const columnMappings = {
        course_code: ['course_code', 'course', 'code', 'course_id', 'courseCode'],
        course_title: ['course_title', 'title', 'course_name', 'name'],
        credits: ['credits', 'credit', 'cr', 'credit_hours'],
        grade: ['grade', 'grades', 'letter_grade'],
        semester: ['semester', 'term', 'session'],
        year: ['year', 'yr'],
        attempt: ['attempt', 'try', 'retake']
    };

    courses.forEach((row, index) => {
        const rowNum = index + 2; // Assuming header is row 1
        try {
            let courseCode = String(getFieldValue(row, columnMappings.course_code)).trim();
            // Normalize
            courseCode = courseCode.replace(/\s+/g, '').toUpperCase();

            const courseTitle = String(getFieldValue(row, columnMappings.course_title)).trim();
            const creditsStr = getFieldValue(row, columnMappings.credits, '0');
            const credits = parseFloat(creditsStr) || 0.0;
            const grade = String(getFieldValue(row, columnMappings.grade)).trim();
            const semester = String(getFieldValue(row, columnMappings.semester)).trim();
            const year = String(getFieldValue(row, columnMappings.year)).trim();
            const attemptStr = getFieldValue(row, columnMappings.attempt, '1');
            const attempt = parseInt(attemptStr) || 1;

            if (!courseCode) {
                 // Skip empty rows
                 return;
            }

            const isValidNsu = validateNsuCourse(courseCode);
            if (!isValidNsu) {
                results.invalidCourses.push({
                    row: rowNum,
                    code: courseCode,
                    title: courseTitle,
                    credits: credits,
                    grade: grade || '(blank)'
                });
                return;
            }

            results.totalCourses++;

            const { earnsCredit, isValid, description } = getGradeStatus(grade);

            const courseInfo: CourseInfo = {
                row: rowNum,
                courseCode,
                courseTitle,
                credits,
                grade: grade || '(blank)',
                semester,
                year,
                attempt,
                earnsCredit,
                status: description,
                category: 'UNKNOWN'
            };

            const gradeUpper = grade ? grade.toUpperCase() : '';

            if (!isValid) {
                results.invalidEntries++;
                courseInfo.category = 'INVALID';
            } else if (gradeUpper === 'F') {
                results.failedCredits += credits;
                courseInfo.category = 'FAILED';
            } else if (gradeUpper === 'W') {
                results.withdrawnCredits += credits;
                courseInfo.category = 'WITHDRAWN';
            } else if (gradeUpper === 'I') {
                results.incompleteCredits += credits;
                courseInfo.category = 'INCOMPLETE';
            } else if (gradeUpper === 'AU') {
                results.auditCredits += credits;
                courseInfo.category = 'AUDIT';
            } else if (earnsCredit) {
                results.validCredits += credits;
                courseInfo.category = 'PASSED';
            }

            if (credits === 0) {
                results.zeroCreditCourses++;
            }

            results.courseDetails.push(courseInfo);

        } catch (e) {
            results.errors.push(`Row ${rowNum}: Error processing - ${e}`);
            results.invalidEntries++;
        }
    });

    return { report: generateReport(results), data: results };
}

function generateReport(results: AuditResults): string {
    let report = "";
    
    report += "# NORTH SOUTH UNIVERSITY\n";
    report += "## OFFICIAL TRANSCRIPT OF RECORDS\n\n";
    
    report += "### Student Information\n";
    report += `**Name:** ${results.studentInfo.name}\n`;
    report += `**Student ID:** ${results.studentInfo.id}\n`;
    report += `**Date of Birth:** ${results.studentInfo.dob}\n`;
    report += `**Program:** ${results.studentInfo.program}\n`;
    report += `**Dates of Attendance:** ${results.studentInfo.datesOfAttendance}\n`;
    report += `**Date Awarded:** ${results.studentInfo.dateAwarded}\n\n`;
    
    report += "### Academic History\n\n";
    
    // Group by semester
    const terms: Record<string, CourseInfo[]> = {};
    results.courseDetails.forEach(c => {
        const term = `${c.semester} ${c.year}`.trim() || 'Unknown Term';
        if (!terms[term]) terms[term] = [];
        terms[term].push(c);
    });

    // Sort terms chronologically
    const sortedTerms = Object.keys(terms).sort((a, b) => {
        if (a === 'Unknown Term') return 1;
        if (b === 'Unknown Term') return -1;
        
        const [semA, yearA] = a.split(' ');
        const [semB, yearB] = b.split(' ');
        
        const yA = parseInt(yearA) || 0;
        const yB = parseInt(yearB) || 0;
        
        if (yA !== yB) return yA - yB;
        
        const semOrder: Record<string, number> = { 'Spring': 1, 'Summer': 2, 'Autumn': 3, 'Fall': 3 };
        return (semOrder[semA] || 0) - (semOrder[semB] || 0);
    });

    let termCounter = 1;
    sortedTerms.forEach((term) => {
        const courses = terms[term];
        const yearNum = Math.ceil(termCounter / 3);
        const semNum = ((termCounter - 1) % 3) + 1;
        
        report += `**Year ${yearNum} - Semester ${semNum} (${term})**\n`;
        report += "| Course Code | Course Title | Credits | Grade |\n";
        report += "|---|---|---|---|\n";
        
        let termQualityPoints = 0;
        let termCgpaCredits = 0;

        courses.forEach(c => {
            report += `| ${c.courseCode} | ${c.courseTitle || '-'} | ${c.credits.toFixed(1)} | ${c.grade} |\n`;
            const gp = getGradePoints(c.grade);
            if (gp !== null) {
                termQualityPoints += gp * c.credits;
                termCgpaCredits += c.credits;
            }
        });
        
        const termGpa = termCgpaCredits > 0 ? (termQualityPoints / termCgpaCredits).toFixed(2) : 'N/A';
        report += `**Semester GPA: ${termGpa}**\n\n`;
        
        if (term !== 'Unknown Term') termCounter++;
    });

    report += "### Summary of Academic Performance\n";
    report += `**Total Credits Attempted:** ${(results.validCredits + results.failedCredits + results.withdrawnCredits + results.incompleteCredits + results.auditCredits).toFixed(1)}  \n`;
    report += `**Total Credits Earned:** ${results.validCredits.toFixed(1)}  \n`;
    report += `**Cumulative GPA:** N/A  \n`;
    report += `**Degree:** Unknown  \n`;
    report += `**Class/Honors:** N/A  \n\n`;

    if (results.invalidCourses.length > 0) {
        report += "### Invalid Courses Detected\n";
        results.invalidCourses.forEach(c => {
            report += `* Row ${c.row}: ${c.code} - ${c.title} (${c.credits} cr) - Grade: ${c.grade}\n`;
        });
        report += "\n";
    }

    report += "### Signatures & Authentication\n";
    report += "**Issued By:** Office of the Registrar\n";

    return report;
}

// --- Level 3 Logic ---

interface Level3Results extends Level2Results {
    canGraduate: boolean;
    issues: string[];
    categoryProgress: Record<string, {
        completed: string[];
        missing: string[];
        creditsCompleted: number;
        creditsRequired: number;
        percentage: number;
        electiveCredits?: number;
        electiveRequired?: number;
        electiveCourses?: string[];
    }>;
    missingCourses: string[];
    totalCompleted: number;
    retakeHistory: Record<string, CourseInfo[]>;
    detectedMajor?: string;
    majorScore?: number;
    validNsuCourses: string[];
    unknownCourses: { code: string; credits: number; grade: string }[];
    gradeDistribution?: Record<string, number>;
    prerequisiteWarnings?: string[];
}

export const PROGRAM_CATEGORIES: Record<string, Record<string, { credits: number; courses?: string[]; electives?: string[]; [key: string]: string | number | string[] | undefined }>> = {
    'CSE': {
        'University Core': {
            'credits': 34,
            'courses': ['ENG102', 'ENG103', 'ENG111', 'BEN205', 'PHI104', 'HIS102', 'HIS103', 'SC0101', 'POL101', 'BIO103'],
            'electives': ['SOC101', 'ANT101', 'ENV203', 'GEO205']
        },
        'SEPS Core': {
            'credits': 38,
            'courses': ['MAT116', 'MAT120', 'MAT130', 'MAT250', 'MAT350', 'MAT361', 'PHY107', 'PHY107L', 'PHY108', 'PHY108L', 'CHE101', 'CHE101L', 'CSE115', 'CSE115L', 'CEE110']
        },
        'CSE Major Core': {
            'credits': 42,
            'courses': ['CSE173', 'CSE215', 'CSE215L', 'CSE225', 'CSE225L', 'CSE231', 'CSE231L', 'CSE311', 'CSE311L', 'CSE323', 'CSE327', 'CSE331', 'CSE331L', 'CSE332', 'CSE373', 'CSE425', 'EEE141', 'EEE141L', 'EEE111', 'EEE111L']
        },
        'Capstone & Electives': {
            'credits': 16,
            'courses': ['CSE299', 'CSE499A', 'CSE499B'],
            'major_electives': 9,
            'open_elective': 3,
            'internship': 'CSE498R'
        }
    },
    'BBA': {
        'General Education': {
            'credits': 30,
            'courses': ['ENG103', 'ENG105', 'HIS103', 'PHI101', 'ENV203'],
            'electives': []
        },
        'School Core': {
            'credits': 21,
            'courses': ['ECO101', 'ECO104', 'MIS107', 'BUS251', 'BUS172', 'BUS173', 'BUS135']
        },
        'BBA Core': {
            'credits': 36,
            'courses': ['ACT201', 'ACT202', 'FIN254', 'LAW200', 'INB372', 'MKT202', 'MIS207', 'MGT212', 'MGT351', 'MGT314', 'MGT368', 'MGT489']
        },
        'Major Concentration': {
            'credits': 18,
            'marketing': ['MKT337', 'MKT344', 'MKT460', 'MKT470'],
            'finance': ['FIN433', 'FIN435', 'FIN440', 'FIN444'],
            'accounting': ['ACT310', 'ACT320', 'ACT360', 'ACT370'],
            'hrm': ['HRM340', 'HRM360', 'HRM380', 'HRM450'],
            'mis': ['MIS210', 'MIS310', 'MIS320', 'MIS470'],
            'supply_chain': ['SCM310', 'SCM320', 'SCM450', 'MGT460']
        },
        'Capstone & Electives': {
            'credits': 19,
            'open_electives': 9,
            'internship': 'BUS498'
        }
    },
    'ECONOMICS': {
        'General Education': {
            'credits': 30,
            'courses': ['ENG103', 'ENG105', 'HIS103', 'PHI101', 'ENV203'],
            'electives': []
        },
        'School Core': {
            'credits': 21,
            'courses': ['ECO101', 'ECO104', 'MIS107', 'BUS251', 'BUS172', 'BUS173', 'BUS135']
        },
        'Economics Core': {
            'credits': 36,
            'courses': ['ECO201', 'ECO202', 'ECO301', 'ECO302', 'ECO317', 'ECO328', 'ECO348', 'ECO354', 'ECO372', 'ECO380', 'ECO415', 'ECO472']
        },
        'Capstone & Electives': {
            'credits': 37,
            'open_electives': 9,
            'internship': 'BUS498'
        }
    }
};

function detectMajor(completedCourses: Set<string>, program: string): string | undefined {
    if (program !== 'BBA') return undefined;

    const majors: Record<string, string[]> = {
        'Marketing': ['MKT337', 'MKT344', 'MKT460', 'MKT470'],
        'Finance': ['FIN433', 'FIN435', 'FIN440', 'FIN444'],
        'Accounting': ['ACT310', 'ACT320', 'ACT360', 'ACT370'],
        'HRM': ['HRM340', 'HRM360', 'HRM380', 'HRM450'],
        'MIS': ['MIS210', 'MIS310', 'MIS320', 'MIS470'],
        'Supply Chain': ['SCM310', 'SCM320', 'SCM450', 'MGT460']
    };

    let bestMajor: string | undefined;
    let maxCount = 0;

    for (const [major, courses] of Object.entries(majors)) {
        const count = courses.filter(c => completedCourses.has(c)).length;
        if (count > maxCount) {
            maxCount = count;
            bestMajor = major;
        }
    }
    return bestMajor;
}

export function performLevel3Audit(csvContent: string, program?: string): { report: string, data: any } {
    const { studentInfo, courses: csvData } = parseTranscriptCsv(csvContent);
    
    const results: Level3Results = {
        studentInfo,
        totalCourses: 0,
        validCredits: 0.0,
        failedCredits: 0.0,
        withdrawnCredits: 0.0,
        incompleteCredits: 0.0,
        auditCredits: 0.0,
        zeroCreditCourses: 0,
        invalidEntries: 0,
        invalidCourses: [],
        courseDetails: [],
        errors: [],
        cgpaCredits: 0.0,
        qualityPoints: 0.0,
        cgpa: 0.0,
        program: program ? program.toUpperCase() : 'CSE', // Default, will be updated
        waiverCourses: {},
        adjustedRequired: 0,
        waivedCredits: 0,
        programTotal: 0,
        canGraduate: false,
        issues: [],
        categoryProgress: {},
        missingCourses: [],
        totalCompleted: 0,
        retakeHistory: {},
        validNsuCourses: [],
        unknownCourses: [],
        gradeDistribution: {},
        prerequisiteWarnings: []
    };

    const columnMappings = {
        course_code: ['course_code', 'course', 'code', 'course_id', 'courseCode'],
        course_title: ['course_title', 'title', 'course_name', 'name'],
        credits: ['credits', 'credit', 'cr', 'credit_hours'],
        grade: ['grade', 'grades', 'letter_grade'],
        semester: ['semester', 'term', 'session'],
        year: ['year', 'yr'],
        attempt: ['attempt', 'try', 'retake']
    };

    // 1. Process all courses first
    const allCourses: CourseInfo[] = [];
    const coursesByCode: Record<string, CourseInfo[]> = {};
    const allCourseCodes: string[] = [];

    csvData.forEach((row, index) => {
        const rowNum = index + 2;
        try {
            let courseCode = String(getFieldValue(row, columnMappings.course_code)).trim();
            // Normalize
            courseCode = courseCode.replace(/\s+/g, '').toUpperCase();

            if (!courseCode) return;
            
            allCourseCodes.push(courseCode);

            const courseTitle = String(getFieldValue(row, columnMappings.course_title)).trim();
            const creditsStr = getFieldValue(row, columnMappings.credits, '0');
            const credits = parseFloat(creditsStr) || 0.0;
            const grade = String(getFieldValue(row, columnMappings.grade)).trim();
            const semester = String(getFieldValue(row, columnMappings.semester)).trim();
            const year = String(getFieldValue(row, columnMappings.year)).trim();
            const attemptStr = getFieldValue(row, columnMappings.attempt, '1');
            const attempt = parseInt(attemptStr) || 1;

            const isValidNsu = validateNsuCourse(courseCode);
            if (!isValidNsu) {
                results.invalidCourses.push({
                    row: rowNum,
                    code: courseCode,
                    title: courseTitle,
                    credits: credits,
                    grade: grade || '(blank)'
                });
                return;
            }

            const { earnsCredit, isValid, description } = getGradeStatus(grade);
            
            const courseInfo: CourseInfo = {
                row: rowNum,
                courseCode,
                courseTitle,
                credits,
                grade: grade || '(blank)',
                semester,
                year,
                attempt,
                earnsCredit,
                status: description,
                category: isValid ? (earnsCredit ? 'PASSED' : 'FAILED') : 'INVALID' // Simplified initial category
            };

            allCourses.push(courseInfo);
            
            const baseCode = courseCode.endsWith('L') ? courseCode.slice(0, -1) : courseCode;
            if (!coursesByCode[baseCode]) coursesByCode[baseCode] = [];
            coursesByCode[baseCode].push(courseInfo);

        } catch (e) {
            results.errors.push(`Row ${rowNum}: Error processing - ${e}`);
        }
    });

    // Detect Program if not provided
    if (!program) {
        results.program = detectProgram(allCourseCodes);
    }

    const reqs = PROGRAM_REQUIREMENTS[results.program] || PROGRAM_REQUIREMENTS['CSE'];
    results.programTotal = reqs.total;
    results.adjustedRequired = reqs.total; // Default before waiver check

    // 2. Apply Retake Logic (Best Grade)
    const bestCourses: Record<string, CourseInfo> = {};
    
    Object.entries(coursesByCode).forEach(([baseCode, attempts]) => {
        const validAttempts = attempts.filter(a => getGradePoints(a.grade) !== null);
        
        if (validAttempts.length > 0) {
            // Find best attempt: Max grade points, then min attempt number (earliest best)
            // Python logic: max(valid_attempts, key=lambda x: (x['grade_points'], -x['attempt']))
            // Here: sort desc by GP, then asc by attempt
            validAttempts.sort((a, b) => {
                const gpA = getGradePoints(a.grade) || -1;
                const gpB = getGradePoints(b.grade) || -1;
                if (gpA !== gpB) return gpB - gpA;
                return a.attempt - b.attempt;
            });
            
            bestCourses[baseCode] = validAttempts[0];

            if (validAttempts.length > 1) {
                results.retakeHistory[baseCode] = attempts.sort((a, b) => a.attempt - b.attempt);
            }
        }
    });

    // Calculate Grade Distribution (from Best Courses)
    results.gradeDistribution = {};
    Object.values(bestCourses).forEach(course => {
        const grade = course.grade.toUpperCase();
        if (results.gradeDistribution![grade]) {
            results.gradeDistribution![grade]++;
        } else {
            results.gradeDistribution![grade] = 1;
        }
    });

    // 3. Calculate CGPA & Stats based on BEST courses
    Object.values(bestCourses).forEach(course => {
        const gp = getGradePoints(course.grade);
        if (gp !== null) {
            results.cgpaCredits += course.credits;
            results.qualityPoints += (course.credits * gp);
            
            if (course.grade.toUpperCase() === 'F') {
                results.failedCredits += course.credits;
            } else {
                results.validCredits += course.credits;
            }
        }
    });

    if (results.cgpaCredits > 0) {
        results.cgpa = results.qualityPoints / results.cgpaCredits;
    }

    // 4. Check Requirements
    const completedSet = new Set(Object.keys(bestCourses));
    const categories = PROGRAM_CATEGORIES[results.program] || PROGRAM_CATEGORIES['CSE'];
    
    results.detectedMajor = detectMajor(completedSet, results.program);
    let totalCompletedCredits = 0;

    // Track all required courses to identify open electives later
    const allRequiredCourses = new Set<string>();

    Object.entries(categories).forEach(([catName, catData]) => {
        let requiredCourses = catData.courses || [];
        
        // Handle BBA Major Concentration
        if (catName === 'Major Concentration' && results.detectedMajor) {
            const majorKey = results.detectedMajor.toLowerCase().replace(' ', '_');
            requiredCourses = (catData[majorKey] as string[]) || [];
        }

        requiredCourses.forEach((c: string) => allRequiredCourses.add(c));
        if (catName === 'University Core' && catData.electives) {
            catData.electives.forEach((c: string) => allRequiredCourses.add(c));
        }
        // Add all BBA major options to "required" set so they aren't counted as open electives if taken extra
        if (results.program === 'BBA' && catName === 'Major Concentration') {
             ['marketing', 'finance', 'accounting', 'hrm', 'mis', 'supply_chain'].forEach(m => {
                 if (catData[m]) (catData[m] as string[]).forEach((c: string) => allRequiredCourses.add(c));
             });
        }

        const completedInCategory: string[] = [];
        let catCredits = 0;

        requiredCourses.forEach((course: string) => {
            if (completedSet.has(course)) {
                completedInCategory.push(course);
                catCredits += bestCourses[course].credits;
            } else {
                results.missingCourses.push(course);
            }
        });
        
        const missingInCategory = requiredCourses.filter((c: string) => !completedSet.has(c));

        results.categoryProgress[catName] = {
            completed: completedInCategory,
            missing: missingInCategory,
            creditsCompleted: catCredits,
            creditsRequired: catData.credits,
            percentage: catData.credits > 0 ? (catCredits / catData.credits * 100) : 0
        };
        
        totalCompletedCredits += catCredits;
    });

    // Prerequisite Check for Missing Courses
    results.missingCourses.forEach(missing => {
        if (PREREQUISITES[missing]) {
            const prereqs = PREREQUISITES[missing];
            const missingPrereqs = prereqs.filter(p => !completedSet.has(p));
            if (missingPrereqs.length > 0) {
                results.prerequisiteWarnings!.push(`Cannot take **${missing}** yet. Missing prerequisite(s): ${missingPrereqs.join(', ')}`);
            }
        }
    });

    // Open Electives Logic
    let electiveCredits = 0;
    const electiveCourses: string[] = [];
    
    completedSet.forEach(course => {
        if (!allRequiredCourses.has(course)) {
            // Only count valid NSU courses as electives
            if (validateNsuCourse(course)) {
                electiveCredits += bestCourses[course].credits;
                electiveCourses.push(course);
            } else {
                results.unknownCourses.push({
                    code: course,
                    credits: bestCourses[course].credits,
                    grade: bestCourses[course].grade
                });
            }
        } else {
            results.validNsuCourses.push(course);
        }
    });

    // Add elective info to Capstone category if exists
    if (results.categoryProgress['Capstone & Electives']) {
        const cap = results.categoryProgress['Capstone & Electives'];
        let openRequired = 0;
        if (results.program === 'CSE') openRequired = 3;
        else if (results.program === 'BBA') openRequired = 9;
        else if (results.program === 'ECONOMICS') openRequired = 9;

        cap.electiveCredits = Math.min(electiveCredits, openRequired);
        cap.electiveRequired = openRequired;
        cap.electiveCourses = electiveCourses;
        
        // Add capped elective credits to total
        totalCompletedCredits += cap.electiveCredits;
    }

    results.totalCompleted = totalCompletedCredits;

    // 5. Graduation Check
    results.canGraduate = true;
    if (results.cgpa < 2.0) {
        results.canGraduate = false;
        results.issues.push(`CGPA ${results.cgpa.toFixed(2)} is below 2.00 minimum`);
    }
    if (results.totalCompleted < results.programTotal) {
        results.canGraduate = false;
        results.issues.push(`Only ${results.totalCompleted.toFixed(1)}/${results.programTotal} credits completed`);
    }
    if (results.missingCourses.length > 0) {
        results.canGraduate = false;
        results.issues.push(`Missing ${results.missingCourses.length} required courses`);
    }

    // 6. Waiver Check (Simplified for non-interactive)
    const waiverList = Object.keys(reqs.waivers);
    waiverList.forEach(course => {
        if (completedSet.has(course)) {
             const grade = bestCourses[course].grade;
             // Check pass
             if (getGradePoints(grade) !== null && getGradePoints(grade)! >= 1.0) {
                 results.waiverCourses[course] = 'COMPLETED';
             } else {
                 results.waiverCourses[course] = 'REQUIRED'; // Failed, so required/waived
             }
        } else {
            results.waiverCourses[course] = 'REQUIRED';
        }
    });

    return { report: generateLevel3Report(results), data: results };
}

function generateLevel3Report(results: Level3Results): string {
    let report = generateBaseTranscript(results);

    const makeBar = (percent: number, length = 20) => {
        const filled = Math.max(0, Math.min(length, Math.round((percent / 100) * length)));
        return '█'.repeat(filled) + '░'.repeat(length - filled);
    };

    report += "---\n\n";
    report += "## ACADEMIC AUDIT REPORT (LEVEL 3: DEFICIENCY REPORTER)\n\n";

    report += `### GRADUATION STATUS: [${results.canGraduate ? 'YES' : 'NO'}] ${results.canGraduate ? 'ELIGIBLE TO GRADUATE' : 'CANNOT GRADUATE'}\n\n`;

    if (!results.canGraduate) {
        report += "#### ISSUES PREVENTING GRADUATION:\n";
        report += `Only ${results.validCredits.toFixed(1)}/${results.adjustedRequired} credits completed  \n`;
        if (results.missingCourses.length > 0) {
            report += `Missing ${results.missingCourses.length} required courses  \n`;
        }
        report += "\n";
    }

    report += "### CGPA SUMMARY (Best Grades Only)\n";
    report += `**CGPA:** ${results.cgpa.toFixed(2)}  \n`;
    report += `**Academic Standing:** [${results.cgpa >= 2.0 ? '+' : '-'}] ${results.cgpa >= 2.0 ? 'GOOD STANDING' : 'PROBATION'}  \n`;
    report += `**Credits Earned:** ${results.validCredits.toFixed(1)}  \n`;
    report += `**Failed Credits:** ${results.failedCredits.toFixed(1)}  \n\n`;

    report += "#### Grade Distribution\n";
    const gradeCounts: Record<string, number> = {};
    let maxGradeCount = 0;
    results.courseDetails.forEach(c => {
        if (c.category !== 'INVALID' && c.category !== 'WITHDRAWN' && c.category !== 'AUDIT' && c.category !== 'INCOMPLETE') {
            const g = c.grade.toUpperCase();
            gradeCounts[g] = (gradeCounts[g] || 0) + 1;
            if (gradeCounts[g] > maxGradeCount) maxGradeCount = gradeCounts[g];
        }
    });

    const gradeOrder = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
    report += "```text\n";
    gradeOrder.forEach(g => {
        if (gradeCounts[g]) {
            const count = gradeCounts[g];
            const barLen = Math.max(1, Math.round((count / maxGradeCount) * 15));
            report += `${g.padEnd(3)} : ${'█'.repeat(barLen)} (${count})\n`;
        }
    });
    report += "```\n\n";

    report += "### PROGRAM REQUIREMENT PROGRESS\n";
    Object.entries(results.categoryProgress).forEach(([cat, data]) => {
        report += `**${cat}** \`${makeBar(data.percentage)}\` ${data.percentage.toFixed(1)}%  \n`;
        report += `Credits: ${data.creditsCompleted.toFixed(1)}/${data.creditsRequired.toFixed(1)}  \n`;
        if (data.missing.length > 0) {
            const missingList = data.missing.slice(0, 3).join(', ');
            const moreCount = data.missing.length - 3;
            report += `Missing: ${missingList} ${moreCount > 0 ? `... and ${moreCount} more` : ''}  \n`;
        }
        report += "\n";
    });

    if (results.prerequisiteWarnings && results.prerequisiteWarnings.length > 0) {
        report += "### ⚠️ ADVISING WARNINGS (Prerequisites)\n";
        results.prerequisiteWarnings.forEach(w => {
            report += `${w}  \n`;
        });
        report += "\n";
    }

    if (results.missingCourses.length > 0) {
        report += "### MISSING MANDATORY COURSES\n";
        const showMissing = results.missingCourses.slice(0, 10);
        showMissing.forEach(c => {
            report += `${c}  \n`;
        });
        if (results.missingCourses.length > 10) {
            report += `... and ${results.missingCourses.length - 10} more courses  \n`;
        }
        report += "\n";
    }

    const retakes: Record<string, CourseInfo[]> = {};
    results.courseDetails.forEach(c => {
        if (!retakes[c.courseCode]) retakes[c.courseCode] = [];
        retakes[c.courseCode].push(c);
    });
    const coursesWithRetakes = Object.entries(retakes).filter(([, attempts]) => attempts.length > 1);

    if (coursesWithRetakes.length > 0) {
        report += "### RETAKE HISTORY\n";
        coursesWithRetakes.forEach(([code, attempts]) => {
            report += `**${code}:**  \n`;
            attempts.forEach((a, i) => {
                report += `* Attempt ${i + 1}: ${a.grade} (${a.semester} ${a.year})  \n`;
            });
        });
        report += "\n";
    }

    report += "---\n";
    report += "### FINAL SUMMARY\n";
    report += `**Graduation Eligibility:** [${results.canGraduate ? 'YES' : 'NO'}]  \n`;
    report += `**CGPA:** ${results.cgpa.toFixed(2)}  \n`;
    report += `**Credits Earned:** ${results.validCredits.toFixed(1)} / ${results.adjustedRequired}  \n`;
    const overallProgress = Math.min(100, (results.validCredits / results.adjustedRequired) * 100);
    report += `**Progress:** ${overallProgress.toFixed(1)}%  \n`;
    
    if (!results.canGraduate) {
        const creditsNeeded = Math.max(0, results.adjustedRequired - results.validCredits);
        const estSemesters = Math.ceil(creditsNeeded / 15);
        report += `**Estimated Time to Graduate:** ${estSemesters} semesters (approx. 15 cr/sem)  \n`;
    }

    return report;
}

// --- Level 2 Logic ---

export const GRADE_POINTS: Record<string, number> = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0,
    'F': 0.0
};

export const PROGRAM_REQUIREMENTS: Record<string, { total: number; waivers: Record<string, number> }> = {
    'CSE': { total: 130, waivers: { 'ENG102': 3, 'MAT116': 3 } },
    'BBA': { total: 124, waivers: { 'ENG102': 3, 'BUS112': 3 } },
    'ECONOMICS': { total: 124, waivers: { 'ENG102': 3, 'MAT112': 3 } }
};

export const WAIVER_CRITERIA: Record<string, string> = {
    'ENG102': 'SAT/IELTS scores or high admission test performance',
    'BUS112': 'SAT 1150+ or high admission test scores',
    'MAT112': 'Entry test (for BBA/Economics students)',
    'MAT116': 'Entry test (for CSE/Engineering students)'
};

export function getGradePoints(grade: string): number | null {
    if (!grade || grade.trim() === '') return null;
    const gradeUpper = grade.trim().toUpperCase();
    
    // Excluded grades
    if (['W', 'I', 'AU'].includes(gradeUpper)) return null;
    
    return GRADE_POINTS[gradeUpper] ?? null;
}

interface Level2Results extends AuditResults {
    cgpaCredits: number;
    qualityPoints: number;
    cgpa: number;
    program: string;
    waiverCourses: Record<string, boolean | 'REQUIRED' | 'COMPLETED'>;
    adjustedRequired: number;
    waivedCredits: number;
    programTotal: number;
}

// ... existing imports ...

export function detectProgram(courseCodes: string[]): string {
    const cseMarkers = new Set(['CSE115', 'CSE215', 'CSE225', 'MAT120', 'PHY107', 'EEE141', 'EEE111']);
    const bbaMarkers = new Set(['BUS101', 'MGT210', 'MKT202', 'ACT201', 'FIN254', 'BUS112']);
    const ecoMarkers = new Set(['ECO101', 'ECO104', 'ECO203', 'ECO244', 'MAT112']);

    let cseCount = 0;
    let bbaCount = 0;
    let ecoCount = 0;

    courseCodes.forEach(code => {
        // Markers are already normalized in the set, so we check against normalized input
        if (cseMarkers.has(code)) cseCount++;
        if (bbaMarkers.has(code)) bbaCount++;
        if (ecoMarkers.has(code)) ecoCount++;
    });

    if (cseCount > bbaCount && cseCount > ecoCount) return 'CSE';
    if (bbaCount > cseCount && bbaCount > ecoCount) return 'BBA';
    if (ecoCount > cseCount && ecoCount > bbaCount) return 'ECONOMICS';
    
    return 'CSE'; // Default
}

// ... existing code ...

export function performLevel2Audit(csvContent: string, program?: string): { report: string, data: any } {
    const { studentInfo, courses: csvData } = parseTranscriptCsv(csvContent);
    
    const results: Level2Results = {
        studentInfo,
        totalCourses: 0,
        validCredits: 0.0,
        failedCredits: 0.0,
        withdrawnCredits: 0.0,
        incompleteCredits: 0.0,
        auditCredits: 0.0,
        zeroCreditCourses: 0,
        invalidEntries: 0,
        invalidCourses: [],
        courseDetails: [],
        errors: [],
        cgpaCredits: 0.0,
        qualityPoints: 0.0,
        cgpa: 0.0,
        program: program ? program.toUpperCase() : 'CSE', // Default, will be updated
        waiverCourses: {},
        adjustedRequired: 0,
        waivedCredits: 0,
        programTotal: 0
    };

    const columnMappings = {
        course_code: ['course_code', 'course', 'code', 'course_id', 'courseCode'],
        course_title: ['course_title', 'title', 'course_name', 'name'],
        credits: ['credits', 'credit', 'cr', 'credit_hours'],
        grade: ['grade', 'grades', 'letter_grade'],
        semester: ['semester', 'term', 'session'],
        year: ['year', 'yr'],
        attempt: ['attempt', 'try', 'retake']
    };

    // Track found courses for waiver check AND program detection
    const foundCourses = new Set<string>();
    const allCourseCodes: string[] = [];

    csvData.forEach((row, index) => {
        const rowNum = index + 2;
        try {
            let courseCode = String(getFieldValue(row, columnMappings.course_code)).trim();
            // Normalize
            courseCode = courseCode.replace(/\s+/g, '').toUpperCase();
            
            if (!courseCode) return;
            
            allCourseCodes.push(courseCode);

            const courseTitle = String(getFieldValue(row, columnMappings.course_title)).trim();
            const creditsStr = getFieldValue(row, columnMappings.credits, '0');
            const credits = parseFloat(creditsStr) || 0.0;
            const grade = String(getFieldValue(row, columnMappings.grade)).trim();
            const semester = String(getFieldValue(row, columnMappings.semester)).trim();
            const year = String(getFieldValue(row, columnMappings.year)).trim();
            const attemptStr = getFieldValue(row, columnMappings.attempt, '1');
            const attempt = parseInt(attemptStr) || 1;

            const isValidNsu = validateNsuCourse(courseCode);
            if (!isValidNsu) {
                results.invalidCourses.push({
                    row: rowNum,
                    code: courseCode,
                    title: courseTitle,
                    credits: credits,
                    grade: grade || '(blank)'
                });
                return;
            }

            results.totalCourses++;

            // Track for waivers (handle L suffix)
            const baseCode = courseCode.endsWith('L') ? courseCode.slice(0, -1) : courseCode;
            foundCourses.add(baseCode);

            const { earnsCredit, isValid, description } = getGradeStatus(grade);
            const gradePoints = getGradePoints(grade);

            // CGPA Calculation Logic
            if (gradePoints !== null) {
                results.cgpaCredits += credits;
                results.qualityPoints += (credits * gradePoints);
            }

            const courseInfo: CourseInfo = {
                row: rowNum,
                courseCode,
                courseTitle,
                credits,
                grade: grade || '(blank)',
                semester,
                year,
                attempt,
                earnsCredit,
                status: description,
                category: 'UNKNOWN'
            };

            const gradeUpper = grade ? grade.toUpperCase() : '';

            if (!isValid) {
                results.invalidEntries++;
                courseInfo.category = 'INVALID';
            } else if (gradeUpper === 'F') {
                results.failedCredits += credits;
                courseInfo.category = 'FAILED';
                courseInfo.status = `F - Failure (0.0 GPA, No Credit)`;
            } else if (gradeUpper === 'W') {
                results.withdrawnCredits += credits;
                courseInfo.category = 'WITHDRAWN';
                courseInfo.status = `W - Withdrawn (No Credit, Excluded from CGPA)`;
            } else if (gradeUpper === 'I') {
                results.incompleteCredits += credits;
                courseInfo.category = 'INCOMPLETE';
                courseInfo.status = `I - Incomplete (No Credit, Excluded from CGPA)`;
            } else if (gradeUpper === 'AU') {
                results.auditCredits += credits;
                courseInfo.category = 'AUDIT';
                courseInfo.status = `AU - Audit (No Credit, Excluded from CGPA)`;
            } else if (earnsCredit) {
                results.validCredits += credits;
                courseInfo.category = 'PASSED';
                courseInfo.status = `${gradeUpper} - Passing (${gradePoints} GPA, Earns Credit)`;
            }

            if (credits === 0) results.zeroCreditCourses++;

            results.courseDetails.push(courseInfo);

        } catch (e) {
            results.errors.push(`Row ${rowNum}: Error processing - ${e}`);
            results.invalidEntries++;
        }
    });

    // Detect Program if not provided
    if (!program) {
        results.program = detectProgram(allCourseCodes);
    }

    const reqs = PROGRAM_REQUIREMENTS[results.program] || PROGRAM_REQUIREMENTS['CSE'];
    results.programTotal = reqs.total;

    // Calculate Final CGPA
    if (results.cgpaCredits > 0) {
        results.cgpa = results.qualityPoints / results.cgpaCredits;
    } else {
        results.cgpa = 0.0;
    }

    // Waiver Logic
    const waiverList = Object.keys(reqs.waivers);
    
    waiverList.forEach(course => {
        if (foundCourses.has(course)) {
            results.waiverCourses[course] = 'COMPLETED'; 
        } else {
            results.waiverCourses[course] = 'REQUIRED';
        }
    });

    results.adjustedRequired = results.programTotal;

    return { report: generateLevel2Report(results), data: results };
}

function generateBaseTranscript(results: Level2Results): string {
    let report = "";
    
    report += "# NORTH SOUTH UNIVERSITY\n";
    report += "## OFFICIAL TRANSCRIPT OF RECORDS\n\n";
    
    report += "### Student Information\n";
    report += `**Name:** ${results.studentInfo.name}\n`;
    report += `**Student ID:** ${results.studentInfo.id}\n`;
    report += `**Date of Birth:** ${results.studentInfo.dob}\n`;
    report += `**Program:** ${results.studentInfo.program || results.program}\n`;
    report += `**Dates of Attendance:** ${results.studentInfo.datesOfAttendance}\n`;
    report += `**Date Awarded:** ${results.studentInfo.dateAwarded}\n\n`;
    
    report += "### Academic History\n\n";
    
    // Group by semester
    const terms: Record<string, CourseInfo[]> = {};
    results.courseDetails.forEach(c => {
        const term = `${c.semester} ${c.year}`.trim() || 'Unknown Term';
        if (!terms[term]) terms[term] = [];
        terms[term].push(c);
    });

    // Sort terms chronologically
    const sortedTerms = Object.keys(terms).sort((a, b) => {
        if (a === 'Unknown Term') return 1;
        if (b === 'Unknown Term') return -1;
        
        const [semA, yearA] = a.split(' ');
        const [semB, yearB] = b.split(' ');
        
        const yA = parseInt(yearA) || 0;
        const yB = parseInt(yearB) || 0;
        
        if (yA !== yB) return yA - yB;
        
        const semOrder: Record<string, number> = { 'Spring': 1, 'Summer': 2, 'Autumn': 3, 'Fall': 3 };
        return (semOrder[semA] || 0) - (semOrder[semB] || 0);
    });

    let termCounter = 1;
    sortedTerms.forEach((term) => {
        const courses = terms[term];
        const yearNum = Math.ceil(termCounter / 3);
        const semNum = ((termCounter - 1) % 3) + 1;
        
        report += `**Year ${yearNum} - Semester ${semNum} (${term})**\n`;
        report += "| Course Code | Course Title | Credits | Grade |\n";
        report += "|---|---|---|---|\n";
        
        let termQualityPoints = 0;
        let termCgpaCredits = 0;

        courses.forEach(c => {
            report += `| ${c.courseCode} | ${c.courseTitle || '-'} | ${c.credits.toFixed(1)} | ${c.grade} |\n`;
            const gp = getGradePoints(c.grade);
            if (gp !== null) {
                termQualityPoints += gp * c.credits;
                termCgpaCredits += c.credits;
            }
        });
        
        const termGpa = termCgpaCredits > 0 ? (termQualityPoints / termCgpaCredits).toFixed(2) : 'N/A';
        report += `**Semester GPA: ${termGpa}**\n\n`;
        
        if (term !== 'Unknown Term') termCounter++;
    });

    report += "### Summary of Academic Performance\n";
    report += `**Total Credits Earned:** ${results.validCredits.toFixed(1)}\n`;
    report += `**Cumulative GPA:** ${results.cgpa.toFixed(2)}/4.0\n`;
    report += `**Degree:** ${results.program}\n`;
    
    let honors = 'N/A';
    if (results.cgpa >= 3.8) honors = 'Summa Cum Laude';
    else if (results.cgpa >= 3.65) honors = 'Magna Cum Laude';
    else if (results.cgpa >= 3.5) honors = 'Cum Laude';
    
    report += `**Class/Honors:** ${honors}\n\n`;

    if (results.invalidCourses.length > 0) {
        report += "### Invalid Courses Detected\n";
        results.invalidCourses.forEach(c => {
            report += `* Row ${c.row}: ${c.code} - ${c.title} (${c.credits} cr) - Grade: ${c.grade}\n`;
        });
        report += "\n";
    }

    report += "### Signatures & Authentication\n";
    report += "**Issued By:** Office of the Registrar\n\n";

    return report;
}

function generateLevel2Report(results: Level2Results): string {
    let report = generateBaseTranscript(results);
    
    report += "---\n\n";
    report += "### Academic Audit (Advising Use Only)\n\n";
    report += `**Academic Standing:** ${results.cgpa >= 2.0 ? 'Good Standing' : 'Probation'}\n\n`;

    report += "**Attention Needed:**\n";
    const failed = results.courseDetails.filter(c => c.category === 'FAILED').map(c => c.courseCode);
    report += `* **Failed Courses (F):** ${failed.length > 0 ? failed.join(', ') : 'None'}\n`;
    
    const lowGrades = results.courseDetails.filter(c => ['C-', 'D+', 'D'].includes(c.grade.toUpperCase())).map(c => c.courseCode);
    report += `* **Low Grades (Consider Retake):** ${lowGrades.length > 0 ? lowGrades.join(', ') : 'None'}\n`;

    if (Object.keys(results.waiverCourses).length > 0) {
        const missingWaivers = Object.entries(results.waiverCourses).filter(([, status]) => status !== 'COMPLETED').map(([course]) => course);
        if (missingWaivers.length > 0) {
            report += `* **Missing Waivers:** ${missingWaivers.join(', ')} (Check if you are eligible)\n`;
        }
    }

    return report;
}