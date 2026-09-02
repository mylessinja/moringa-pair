"""Email service for sending notifications via SendGrid."""
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from flask import current_app


class EmailService:
    """Service for sending emails via SendGrid."""

    @staticmethod
    def send_email(to_email, subject, html_content, plain_text=None):
        """
        Send an email using SendGrid.

        Args:
            to_email (str): Recipient email address
            subject (str): Email subject
            html_content (str): HTML email content
            plain_text (str): Plain text fallback content

        Returns:
            dict: Response with status and message
        """
        try:
            sg_key = os.getenv("SENDGRID_API_KEY")
            if not sg_key:
                return {
                    "success": False,
                    "error": "SendGrid API key not configured",
                }

            from_email = os.getenv("SENDGRID_FROM_EMAIL", "noreply@moringapair.com")
            sg = SendGridAPIClient(sg_key)

            message = Mail(
                from_email=Email(from_email, "MoringaPair Notifications"),
                to_emails=To(to_email),
                subject=subject,
                plain_text_content=plain_text or "Check your email client for HTML version",
                html_content=html_content,
            )

            response = sg.send(message)

            return {
                "success": response.status_code == 202,
                "status_code": response.status_code,
                "message": "Email sent successfully" if response.status_code == 202 else "Failed to send email",
            }
        except Exception as exc:
            return {
                "success": False,
                "error": str(exc),
            }

    @staticmethod
    def send_pairing_notification(user_email, user_name, partner_name, cohort, week, focus):
        """Send pairing notification email."""
        subject = f"New Pairing Announcement - {cohort} Week {week}"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Welcome to Your Weekly Pairing! 👥</h2>
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>We're excited to announce your pairing for this week!</p>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Pairing Details:</h3>
                        <p><strong>Partner:</strong> {partner_name}</p>
                        <p><strong>Cohort:</strong> {cohort}</p>
                        <p><strong>Week:</strong> {week}</p>
                        <p><strong>Focus Area:</strong> {focus or 'General practice'}</p>
                    </div>
                    
                    <p>Log in to your MoringaPair account to see more details and schedule your session with your partner.</p>
                    
                    <p>Best wishes for a productive pairing session!</p>
                    <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                        MoringaPair Team<br>
                        <em>Empowering students through peer learning</em>
                    </p>
                </div>
            </body>
        </html>
        """
        plain_text = f"""
        Welcome to Your Weekly Pairing!
        
        Hi {user_name},
        
        We're excited to announce your pairing for this week!
        
        Pairing Details:
        Partner: {partner_name}
        Cohort: {cohort}
        Week: {week}
        Focus Area: {focus or 'General practice'}
        
        Log in to your MoringaPair account to see more details and schedule your session with your partner.
        
        Best wishes for a productive pairing session!
        
        MoringaPair Team
        Empowering students through peer learning
        """
        return EmailService.send_email(to_email, subject, html_content, plain_text)

    @staticmethod
    def send_feedback_notification(user_email, user_name, mentor_name, feedback_summary):
        """Send feedback notification email."""
        subject = f"Feedback from {mentor_name} 📝"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">You have new feedback! 📝</h2>
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>You've received feedback from your mentor, <strong>{mentor_name}</strong>.</p>
                    
                    <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Feedback Summary:</h3>
                        <p>{feedback_summary}</p>
                    </div>
                    
                    <p>Log in to MoringaPair to view the complete feedback and continue your learning journey.</p>
                    
                    <p>Keep up the great work!</p>
                    <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                        MoringaPair Team
                    </p>
                </div>
            </body>
        </html>
        """
        return EmailService.send_email(user_email, subject, html_content)

    @staticmethod
    def send_pairing_complete_notification(user_email, user_name, partner_name):
        """Send notification when pairing session is completed."""
        subject = f"Pairing Session Completed with {partner_name} ✅"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Great Job! ✅</h2>
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>Your pairing session with <strong>{partner_name}</strong> has been marked as completed.</p>
                    
                    <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p>Congratulations on completing another valuable peer learning session!</p>
                    </div>
                    
                    <p>Continue building your skills and supporting your peers. See you in the next pairing!</p>
                    
                    <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                        MoringaPair Team
                    </p>
                </div>
            </body>
        </html>
        """
        return EmailService.send_email(user_email, subject, html_content)

    @staticmethod
    def send_assessment_reminder(user_email, user_name, assessment_name, due_date):
        """Send assessment reminder email."""
        subject = f"Reminder: {assessment_name} Due Soon 📌"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Assessment Reminder 📌</h2>
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>This is a reminder that your assessment is coming up!</p>
                    
                    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">{assessment_name}</h3>
                        <p><strong>Due Date:</strong> {due_date}</p>
                    </div>
                    
                    <p>Make sure to complete it on time. Log in to MoringaPair to access the assessment.</p>
                    
                    <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                        MoringaPair Team
                    </p>
                </div>
            </body>
        </html>
        """
        return EmailService.send_email(user_email, subject, html_content)
