import * as path from 'path';
import * as nodemailer from 'nodemailer';

//Using TypeScript’s enum to define sets of constants here (see https://www.typescriptlang.org/docs/handbook/enums.html). Other approaches could be used. May even be better to have another table for them.
export enum TERM_OR_SEMESTER{ //used for two semesters as well
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
    FOURTH = 4,
    NOT_SPECIFIED = 5
}

export enum Gender {
    M = "Male",
    F = "Female"
}

export enum EmploymentStatus{ //used in employeeStatus column below.
    FULLTIME_REGULAR = "Full time regular",
    FULLTIME_CONTRACT = "Full time contract",
    ADJUNCT = "Adjunct faculty",
    GUEST = "Guest lecturer"//may not be in use
}

export enum GradeCategory {
    AT = "Attendance",
    CP = "Class participation",
    CA1 = "Continuous assessment 1",
    CA2 = "Continuous assessment 2",
    CA3 = "Continuous assessment 3",
    Exam = "Examination"
} 

export enum QualificationInView {//This may be better gotten from database
    BSC = "Bachelor of Science",
    BA = "Bachelor of Arts",
    MSC = "Master of Science",
    MA = "Master of Arts",
    PHD = "Doctor of Philosophy",
    PGD = "Postgraduate Diploma",
    CERT = "Certificate Program"
}

export enum Level {//This may also be better from db.
    ONE = "100",
    TWO = "200",
    THREE = "300",
    FOUR = "400",
    FIVE = "500",
    SIX = "600",
    SEVEN = "700",
    NOT_SPECIFIED = "No level specification"
}

//below will look for uploads folder in build directory where the running index.js resides. Ensure that it is created.
export const UPLOAD_DIR = path.join(__dirname,'uploads');

//location for where to find template files relative to index.js location
export const VIEWS_BASE_PATH = 'view/template'; 

//user management
export const PASSWORD_RESET_EXPIRATION = 86400000 * 2 //24 hours * 2 in milliseconds

//Prepare nodemailer using sendgrid. I signed up for one. 
//See https://nodemailer.com/smtp/; https://nodemailer.com/smtp/#authentication
const NodemailerOptions = {
    pool: true,
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth:{//I generated these with my free account
        user: "apikey",
        pass: "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"
    },
    logger: true,
    //debug: true

}
export const smtpTransport: any = nodemailer.createTransport(NodemailerOptions);

export const ResetPasswordMailOptionSettings = {
    textTemplate: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    {url}
    If you did not request this, please ignore this email and your password will remain unchanged.\n\n`,
    //replyAddress: "noreply@pau.edu.ng",
    subject: "Reset Password - pau.edu.ng",
    from: "noreply@pau.edu.ng"

}