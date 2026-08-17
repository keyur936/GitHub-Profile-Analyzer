import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def send_otp_email(to_email, otp_code, user_name="Developer"):
    """
    Sends a real HTML OTP Email to the user's inbox with timeout protection.
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_email = os.getenv("SMTP_EMAIL", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()

    if not smtp_email or not smtp_password:
        print(f"[Email Service Notice] SMTP_EMAIL or SMTP_PASSWORD not set in environment. Demo OTP for {to_email} is: {otp_code}")
        return False, "SMTP server credentials not configured in environment."

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your GitHub Profile Analyzer Verification Code"
        msg["From"] = f"GitHub Profile Analyzer <{smtp_email}>"
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

        # 5 second connection timeout to prevent hanging
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=5)
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, to_email, msg.as_string())
        server.quit()

        print(f"[Email Service Success] Real OTP Email sent to {to_email}")
        return True, f"OTP email sent to {to_email}"
    except Exception as e:
        print(f"[Email Service Warning] SMTP delivery exception for {to_email}: {str(e)}")
        return False, f"Failed to send email: {str(e)}"
