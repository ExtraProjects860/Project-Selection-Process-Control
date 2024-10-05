import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

class EmailService:
    def __init__(self):
        load_dotenv()
        # Carregando variáveis de ambiente ao inicializar a classe
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email_admin = os.getenv("EMAIL_GET_ADMINISTRATOR_TEMPLATE")
        self.email_forgot_password = os.getenv("EMAIL_SERVICE_FORGOT_PASSWORD_TEMPLATE")
        self.password_forgot_password = os.getenv("EMAIL_PASSWORD_APP_FORGOT_PASSWORD_TEMPLATE")
        self.email_status_selection = os.getenv("EMAILS_SENDER_STATUS_SELECTION_PROCESS_TEMPLATE")
        self.password_status_selection = os.getenv("EMAIL_PASSWORD_APP_STATUS_SELECTION_PROCESS_TEMPLATE")
        self.email_warning_subscribe = os.getenv("EMAIL_SERVICE_WARNING_SUBSCRIBE_OF_USER_TEMPLATE")
        self.password_warning_subscribe = os.getenv("EMAIL_PASSWORD_APP_WARNING_SUBSCRIBE_OF_USER_TEMPLATE")


    def read_html_template(self, template_path: str) -> str:
        """Lê o conteúdo de um arquivo HTML e o retorna como string."""
        with open(template_path, "r", encoding="utf-8") as file:
            return file.read()


    def replace_placeholders(self, template: str, replacements: dict[str, str]) -> str:
        """Substitui os placeholders no template com valores fornecidos."""
        for key, value in replacements.items():
            template = template.replace(f"{key}", value)
        return template


    def send_email(self, from_email: str, to_email: str, subject: str, email_html: str, smtp_user: str, smtp_password: str) -> None:
        """Método genérico para envio de e-mails, centralizando a lógica comum."""
        try:
            message = MIMEMultipart()
            message["From"] = from_email
            message["To"] = to_email
            message["Subject"] = subject
            message.attach(MIMEText(email_html, "html"))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as connection:
                connection.starttls()
                connection.login(user=smtp_user, password=smtp_password)
                connection.sendmail(from_email, to_email, message.as_string())
        except smtplib.SMTPException as smtp_error:
            raise Exception(f"Falha ao enviar o e-mail: {smtp_error}")
        except Exception as error:
            raise Exception(f"Erro inesperado ao enviar o e-mail: {error}")

    def send_email_forgot_password(self, send_email: str, subject: str, message: str, token: str) -> None:
        """Envia e-mail de recuperação de senha."""
        template = self.read_html_template(os.path.join(os.getcwd(), "src", "static", "template_trocar_senha.html"))
        email_html = self.replace_placeholders(template, {
            "{title_html}": subject, 
            "{email_html}": send_email, 
            "{text_html}": message, 
            "{token_html}": token,
        })
        self.send_email(self.email_forgot_password, send_email, subject, email_html, self.email_forgot_password, self.password_forgot_password)

    # preciso verificar aqui por que não está enviando para o email email_warning_subscribe
    def send_email_informing_user_registration_to_admin(self, send_email: str, phone_number: str, name_user: str, subject: str, message: str) -> None:
        """Envia e-mail informando ao admin sobre nova inscrição de usuário."""
        template = self.read_html_template(os.path.join(os.getcwd(), "src", "static", "template_aviso_inscricao_do_usuario.html"))
        email_html = self.replace_placeholders(template, {
            "{title_html}": subject, 
            "{text_html}": message,
            "{name_html}": name_user,
            "{email_html}": send_email,
            "{phone_number_html}": phone_number,
        })
        self.send_email(self.email_warning_subscribe, self.email_admin, subject, email_html, self.email_warning_subscribe, self.password_warning_subscribe)


    def send_email_informing_user_status_selection_process(self, send_email: str, subject: str, name_user: str, message: str) -> None:
        """Envia e-mail informando ao usuário sobre a atualização de status do processo seletivo."""
        template = self.read_html_template(os.path.join(os.getcwd(), "src", "static", "template_aviso_atualizacao_status_processo.html"))
        email_html = self.replace_placeholders(template, {
            "{title_html}": subject, 
            "{text_html}": message,
            "{name_html}": name_user,
        })
        self.send_email(self.email_status_selection, send_email, subject, email_html, self.email_status_selection, self.password_status_selection)