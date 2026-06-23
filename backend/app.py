#!/usr/bin/env python3
from flask import Flask, request, make_response, send_from_directory
from flask_cors import CORS
import os
import smtplib
from email.message import EmailMessage

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
app = Flask(__name__, static_folder=PROJECT_ROOT, static_url_path='')
CORS(app)


@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject', 'Website Contact')
        message = request.form.get('message', '')
        phone = request.form.get('phone', '')

        if not name or not email or not message:
            return make_response('Missing required fields', 400)

        receiving_email = os.environ.get('RECEIVING_EMAIL', 'contact@example.com')
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_user = os.environ.get('SMTP_USER')
        smtp_pass = os.environ.get('SMTP_PASS')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))

        email_msg = EmailMessage()
        email_msg['From'] = email
        email_msg['To'] = receiving_email
        email_msg['Subject'] = subject
        body = f"Name: {name}\nEmail: {email}\nPhone: {phone}\n\nMessage:\n{message}"
        email_msg.set_content(body)

        if smtp_host and smtp_user and smtp_pass:
            with smtplib.SMTP(smtp_host, smtp_port) as smtp:
                smtp.starttls()
                smtp.login(smtp_user, smtp_pass)
                smtp.send_message(email_msg)
        else:
            # fallback: save to local log for development
            logs_dir = os.path.join(os.path.dirname(__file__), 'logs')
            os.makedirs(logs_dir, exist_ok=True)
            with open(os.path.join(logs_dir, 'messages.txt'), 'a', encoding='utf-8') as f:
                f.write(body + '\n\n----\n\n')

        return 'OK'
    except Exception as e:
        return make_response(str(e), 500)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_site(path):
    # If a static file exists, serve it. Otherwise return index.html
    if path:
        full_path = os.path.join(app.static_folder, path)
        if os.path.exists(full_path) and not os.path.isdir(full_path):
            return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
