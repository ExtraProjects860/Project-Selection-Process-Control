import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

class EmailService:
    def __init__(self):
        load_dotenv()
        self.__email = os.getenv("EMAIL_SERVICE")
        self.__password = os.getenv("EMAIL_APP_PASSWORD")
        self.__template_path = os.path.join(os.path.dirname(__file__), "static", "corpo_email.html")
        
    def read_html_template(self, template_path):
        with open(template_path, "r", encoding="utf-8") as file:
            return file.read()
        
    def replace_placeholders(self, template, replacements):
        for key, value in replacements.items():
            template = template.replace(f"{key}", value)
        return template

    def send_email(self, send_email, subject, message, token):
        template = self.read_html_template(self.__template_path)
        email_html = self.replace_placeholders(template, {
            "{title_html}": subject, 
            "{email_html}": send_email, 
            "{text_html}": message, 
            "{token_html}": token})
        
        try:
            message = MIMEMultipart()
            message["From"] = self.__email
            message["To"] = send_email
            message["Subject"] = subject
            message.attach(MIMEText(email_html, "html"))
            
            with smtplib.SMTP("smtp.gmail.com", 587) as connection:
                connection.starttls()
                connection.login(user=self.__email, password=self.__password)
                connection.sendmail(message["From"], message["To"], message.as_string())
        except smtplib.SMTPException:
            raise Exception("Failed to send email")