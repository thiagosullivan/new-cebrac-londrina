import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const { OAuth2 } = google.auth;

const email = process.env.MAILADDRESS;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const OAuth2_client = new OAuth2(clientId, clientSecret);
OAuth2_client.setCredentials({ refresh_token: refreshToken });

const accessToken = OAuth2_client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: email,
    clientId,
    clientSecret,
    refreshToken,
    accessToken
  }
});

const mailer = ({ nome, email, phone, unidade, curso }) => {
  const from = nome;

  const message = {
    from,
    to: 'cebrac.londrina.2023@gmail.com',
    subject: `${nome} entrou em contato pelo site`,
    text: `
      Nome: ${nome}\n
      Telefone: ${phone}\n
      E-mail: ${email}\n
      Unidade: ${unidade}\n
      Curso: ${curso}
    `,
    replyTo: email
  };
  
  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) => {
      error ? reject(error) : resolve(info)
    });
  })
};

export default async (req, res) => {
  const { nome, email, phone, unidade, curso } = req.body;

  if(nome === '' || email === ''|| phone === ''|| unidade === '' || curso === '') {
    res.status(403).send();
    return
  }

  const mailerRes = await mailer({ nome, email, phone, unidade, curso });
  res.send(mailerRes);
};