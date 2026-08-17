import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()

def send_otp_email(to_email, otp_code, user_name="Developer"):
    """
    Sends a real HTML OTP Email to the user's inbox.
    """
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print(f"[Email Service Warning] SMTP_EMAIL or SMTP_PASSWORD not configured. OTP for {to_email} is: {otp_code}")
        return False, "SMTP server credentials not configured in environment."

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your GitHub Profile Analyzer Verification Code"
        msg["From"] = f"GitHub Profile Analyzer <{SMTP_EMAIL}>"
        msg["To"] = to_email

        # Plain text fallback
        text_content = f"Hello {user_name},\n\nYour 6-digit OTP code is: {otp_code}\nThis code is valid for 10 minutes.\n\nGitHub Profile Analyzer"

        # HTML Email Body
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d1117; color: #c9d1d9; margin: 0; padding: 20px; }}
            .container {{ max-width: 500px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 32px; text-align: center; }}
            .logo {{ font-size: 20px; font-weight: bold; color: #58a6ff; margin-bottom: 24px; }}
            .otp-box {{ background-color: #0d1117; border: 1px border #30363d; border-radius: 12px; padding: 20px; margin: 24px 0; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f0883e; }}
            .footer {{ font-size: 12px; color: #8b949e; margin-top: 24px; border-top: 1px solid #30363d; padding-top: 16px; }}
          </style>
        </head>
        <body>
          <div className="container">
            <div className="logo">🐙 GitHub Profile Analyzer</div>
            <h2 style="color: #ffffff; margin-bottom: 8px;">Verify Your Email Address</h2>
            <p style="color: #8b949e; font-size: 14px;">Hello <strong>{user_name}</strong>, use the 6-digit OTP code below to complete your registration and claim <strong>100 Free Credits</strong>.</p>
            
            <div className="otp-box">{otp_code}</div>
            
            <p style="color: #8b949e; font-size: 12px;">This code will expire in <strong>10 minutes</strong>. If you did not request this code, please ignore this email.</p>
            
            <div className="footer">
              Built with Flask & React • Official GitHub REST API Integration
            </div>
          </div>
        </body>
        </html>
        """

        part1 = MIMEText(text_content, "plain")
        part2 = MIMEText(html_content, "html")

        msg.attach(part1)
        msg.attach(part2)

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()

        print(f"[Email Service] Real OTP Email successfully sent to {to_email}")
        return True, f"OTP email sent to {to_email}"
    except Exception as e:
        print(f"[Email Service Error] Failed to send email to {to_email}: {str(e)}")
        return False, f"Failed to send email: {str(e)}"
