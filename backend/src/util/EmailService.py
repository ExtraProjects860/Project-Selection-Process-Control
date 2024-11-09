import smtplib
import os
from threading import Thread
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

class EmailService:
    def __init__(self):
        load_dotenv()
        # Carregando variáveis de ambiente ao inicializar a classe
        self.__smtp_server: str = "smtp.gmail.com"
        self.__smtp_port: int = 587
        self.__email_admin: str = os.getenv("EMAIL_GET_ADMINISTRATOR_TEMPLATE")
        self.__email_forgot_password: str = os.getenv("EMAIL_SERVICE_FORGOT_PASSWORD_TEMPLATE")
        self.__password_forgot_password: str = os.getenv("EMAIL_PASSWORD_APP_FORGOT_PASSWORD_TEMPLATE")
        self.__email_status_selection: str = os.getenv("EMAILS_SENDER_STATUS_SELECTION_PROCESS_TEMPLATE")
        self.__password_status_selection: str = os.getenv("EMAIL_PASSWORD_APP_STATUS_SELECTION_PROCESS_TEMPLATE")
        self.__email_warning_subscribe: str = os.getenv("EMAIL_SERVICE_WARNING_SUBSCRIBE_OF_USER_TEMPLATE")
        self.__password_warning_subscribe: str = os.getenv("EMAIL_PASSWORD_APP_WARNING_SUBSCRIBE_OF_USER_TEMPLATE")


    def __read_html_template(self, template_path: str) -> str:
        """Lê o conteúdo de um arquivo HTML e o retorna como string."""
        with open(template_path, "r", encoding="utf-8") as file:
            return file.read()


    def __replace_placeholders(self, template: str, replacements: dict[str, str]) -> str:
        """Substitui os placeholders no template com valores fornecidos."""
        for key, value in replacements.items():
            template = template.replace(f"{key}", value)
        return template
    
    
    def send_email_in_background(self, from_email: str, to_email: str, subject: str, email_html: str, smtp_user: str, smtp_password: str) -> None:
        """
            Envia o e-mail em uma thread separada para não bloquear a execução principal.
        """
        thread: Thread = Thread(
            target=self.send_email,
            args=(from_email, to_email, subject, email_html, smtp_user, smtp_password),
        )
        thread.start()


    def send_email(self, from_email: str, to_email: str, subject: str, email_html: str, smtp_user: str, smtp_password: str) -> None:
        """
            Método genérico para envio de e-mails, centralizando a lógica comum.

            :param from_email: E-mail remetente.
            :param to_email: E-mail destinatário.
            :param subject: Assunto do e-mail.
            :param email_html: Conteúdo HTML do e-mail.
            :param smtp_user: Usuário para autenticação no servidor SMTP.
            :param smtp_password: Senha para autenticação no servidor SMTP.
            :raises Exception: Se ocorrer algum erro durante o envio do e-mail.
        """
        try:
            message = MIMEMultipart()
            message["From"] = from_email
            message["To"] = to_email
            message["Subject"] = subject
            message.attach(MIMEText(email_html, "html"))

            with smtplib.SMTP(self.__smtp_server, self.__smtp_port) as connection:
                connection.starttls()
                connection.login(user=smtp_user, password=smtp_password)
                connection.sendmail(from_email, to_email, message.as_string())
        except smtplib.SMTPException as smtp_error:
            raise Exception(f"SMTPException Erro ao enviar o e-mail: {smtp_error}")
        except smtplib.SMTPRecipientsRefused as recipients_error:
            raise Exception(f"SMTPRecipientsRefused Erro ao enviar o e-mail: {recipients_error}")
        except smtplib.SMTPSenderRefused as sender_error:
            raise Exception(f"SMTPSenderRefused Erro ao enviar o e-mail: {sender_error}")
        except Exception as error:
            raise Exception(f"Erro inesperado ao enviar o e-mail: {error}")


    def send_email_forgot_password(self, send_email: str, subject: str, message: str, token: str) -> None:
        """
            Envia e-mail de recuperação de senha.

            :param send_email: E-mail do destinatário.
            :param subject: Assunto do e-mail.
            :param message: Mensagem personalizada.
            :param token: Token de recuperação de senha.
        """
        template = self.__read_html_template(os.path.join(os.getcwd(), "src", "static", "template_trocar_senha.html"))
        email_html = self.__replace_placeholders(template, {
            "{title_html}": subject, 
            "{email_html}": send_email, 
            "{text_html}": message, 
            "{token_html}": token,
        })
        self.send_email_in_background(
            from_email=self.__email_forgot_password,
            to_email=send_email,
            subject=subject,
            email_html=email_html,
            smtp_user=self.__email_forgot_password,
            smtp_password=self.__password_forgot_password
        )


    # preciso verificar aqui por que não está enviando para o email email_warning_subscribe
    def send_email_informing_user_registration_to_admin(self, send_email: str, phone_number: str, name_user: str, subject: str, message: str) -> None:
        """
            Envia e-mail informando ao admin sobre nova inscrição de usuário.

            :param send_email: E-mail do usuário inscrito.
            :param phone_number: Número de telefone do usuário inscrito.
            :param name_user: Nome do usuário inscrito.
            :param subject: Assunto do e-mail.
            :param message: Mensagem personalizada.
        """
        template = self.__read_html_template(os.path.join(os.getcwd(), "src", "static", "template_aviso_inscricao_do_usuario.html"))
        email_html = self.__replace_placeholders(template, {
            "{title_html}": subject, 
            "{text_html}": message,
            "{name_html}": name_user,
            "{email_html}": send_email,
            "{phone_number_html}": phone_number,
        })
        self.send_email_in_background(
            from_email=self.__email_warning_subscribe,
            to_email=self.__email_admin,
            subject=subject,
            email_html=email_html,
            smtp_user=self.__email_warning_subscribe,
            smtp_password=self.__password_warning_subscribe
        )


    def send_email_informing_user_status_selection_process(self, send_email: str, subject: str, name_user: str, message: str) -> None:
        """
            Envia e-mail informando ao usuário sobre a atualização de status do processo seletivo.

            :param send_email: E-mail do destinatário.
            :param subject: Assunto do e-mail.
            :param name_user: Nome do usuário.
            :param message: Mensagem personalizada.
        """
        template = self.__read_html_template(os.path.join(os.getcwd(), "src", "static", "template_aviso_atualizacao_status_processo.html"))
        email_html = self.__replace_placeholders(template, {
            "{title_html}": subject, 
            "{text_html}": message,
            "{name_html}": name_user,
        })
        self.send_email_in_background(
            from_email=self.__email_status_selection,
            to_email=send_email,
            subject=subject,
            email_html=email_html,
            smtp_user=self.__email_status_selection,
            smtp_password=self.__password_status_selection
        )