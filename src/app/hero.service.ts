import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

import {Hero } from './hero';
//import {HEROES} from './mock-heroes';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';



const httpOptions = {
	headers:new HttpHeaders({'Content-Type':'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private HEROES:Hero[]=[];
  private heroesUrl = "api/heroes";

  constructor(private messageService:MessageService,
  	private http:HttpClient) { }

  getHeroes():Observable<Hero[]>{
  	this.messageService.add('HeroService: fetched heroes');
  	//return of(HEROES);
  	return this.http.get<Hero[]>(this.heroesUrl)
  	.pipe(
  		tap(heroes => {
  			this.HEROES=heroes;
  			this.log("fetch heroes");
  		}),
  		catchError(this.handleError('getHeroes',[]))
  		);
  }
  private log(message:string){
  	this.messageService.add(message);
  }


  getHero(id:number):Observable<Hero>{
  	//this.messageService.add(`HeroService: fetch hero id=${id}`);
  	//return of(this.HEROES.find(hero => hero.id===id));
  	const url = `${this.heroesUrl}/${id}`;
  	return this.http.get<Hero>(url).pipe(
  			tap(_ => this.log(`fetch hero id=${id}`)),
  			catchError(this.handleError<Hero>(`getHero id=${id}`))
  		);
  	
  }
  private handleError<T>(operation ='operation', result?:T){
  	return (error:any):Observable<T> =>{
  		console.error(error);
  		this.log(`${operation} failed:${error.message}`);
  		return of(result as T);
  	}
  }
  updateHero(hero:Hero):Observable<any>{
  	return this.http.put(this.heroesUrl,hero,httpOptions).pipe(
  		tap(_=>this.log(`updated hero id=${hero.id}`)),
  		catchError(this.handleError<any>('updatehero'))		
  		)
  }

  addHero(hero:Hero):Observable<Hero>{
  	return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
  		tap((hero:Hero) => this.log(`added hero w/ id=${hero.id}`)),
  		catchError(this.handleError<Hero>('addHero'))
  		);
  }
  deleteHero(hero:Hero| number):Observable<Hero>{
  	const id = typeof hero === 'number' ? hero:hero.id;
  	const url = `${this.heroesUrl}/${id}`;
  	return this.http.delete<Hero>(url, httpOptions).pipe(
  			tap(_ => this.log(`deleted hero id=${id}`)),
  			catchError(this.handleError<Hero>('deleteHero'))
  		);
  }
  searchHeroes(term:string):Observable<Hero[]>{
  	if (!term.trim()){
  		return of([]);
  	}
  	return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
  			tap(_=>this.log(`found heroes matching "${term}"`)),
  			catchError(this.handleError<Hero[]>('searchHeroes',[]))
  		);
  }
}
