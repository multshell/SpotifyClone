import { Injectable } from '@angular/core';
import { SpotifyConfiguration } from 'src/environments/environment';
import Spotify from 'spotify-web-api-js';
import { IUsuario } from '../interfaces/IUsuario';
import { SpotifyUserToUsuario } from '../common/spotifyHelper';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifyApi: Spotify.SpotifyWebApiJs;
  usuario: IUsuario | undefined;

  constructor() {
    this.spotifyApi = new Spotify();
  }

  async inicializarUsuario() {
    if(!!this.usuario)
      return true;

    const token = localStorage.getItem('token');

    if(!token)
      return false;

    try {

      this.definirAccessToken(token);
      await this.obterSpotifyUsuario();

      return !!this.usuario;

    } catch (error) {

      return false;

    }
  }

  async obterSpotifyUsuario() {
    const userInfo = await this.spotifyApi.getMe();
    this.usuario = SpotifyUserToUsuario(userInfo);
  }

  definirAccessToken(token: string) {
    this.spotifyApi.setAccessToken(token);
    localStorage.setItem('token', token);
    //this.spotifyApi.skipToNext();
  }

  obterUrlLogin() {
    const authEndpoint = `${SpotifyConfiguration.authEndpoint}?`;
    const clientid = `client_id=${SpotifyConfiguration.clientid}&`;
    const redirecturi = `redirect_uri=${SpotifyConfiguration.redirecturi}&`;
    const scopes = `scope=${SpotifyConfiguration.scopes.join('%20')}&`
    const response = `response_type=token&show_dialog=true`;
    return authEndpoint + clientid + redirecturi + scopes + response;
  }

  obterTokenUrlCallback() {

    console.log(window.location.hash);

    if (!window.location.hash)
      return '';

    const params = window.location.hash.substring(1).split('&')[0].split('=')[1];
    
    console.log(params);
    
    return params;

  }
}
