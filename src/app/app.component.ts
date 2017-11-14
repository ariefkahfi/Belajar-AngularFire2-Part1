import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, SnapshotAction, snapshotChanges} from "angularfire2/database";
import {Observable} from "rxjs/Observable";

class Person{
  $key : any;
  username : string;
  password : string;
}

@Component({
  selector: 'app-root',
  template : `
    <h3>Firebase App</h3>
    <div>
      Username : <input #name (input)="username=name.value"/><br/>
      Password : <input type="password" #pass (input)="password=pass.value"/>
      <button [disabled]="username === '' || password === '' " (click)="pushData()">Push Data</button>
    </div>
    
    <div>
      <table border="2">
        <tr>
          <td>Username</td>
          <td>Password</td>
        </tr>
        <tr *ngFor="let u of usersList | async">
          <td>{{u['person-name']}}</td>
          <td>{{u['person-pass']}}</td>
        </tr>
      </table>
    </div>
  `
})
export class AppComponent implements OnInit{

  private usersList = new Observable<any[]>();

  private person = new Person();
  private username = "";
  private password = "";

  // private users : {
  //   name  : string,
  //   password : string
  // };

  pushData(){
    console.log('Username : ' + this.username + "\n" +
      "Password : " + this.password);
    this.firebaseDatabase.list('/person').push(
      {
        'person-name' : this.username,
        'person-pass' : this.password
      }
    );
    // this.firebaseDatabase.object('/person').set({
    //    'person-name' : this.username,
    //    'person-pass' : this.password
    // }).then((success)=>{
    //   console.log('data saved into database');
    // },(error)=>{
    //   console.log('Error');
    // });
  }

  constructor(private firebaseDatabase : AngularFireDatabase ){

  }


  //AngularFireDatabase Demo
  retrieveData(){


    let arr = [{nama : "arief"} , {nama : "putro"} , {nama : "hello"}];

    let test = Observable.of(arr);


    test.map((mapValue)=>(
      mapValue.map((arrValue)=>(
         "Nama Saya " + arrValue.nama
      ))
    )).subscribe((next)=>{
        console.log(next);
    });



   // AngularFireDatabase.list().snaphostChanges()
   // return nya adalah Observable<SnapshostAction[]>
   // agar return dari SnapshotAction[] menjadi array yang baru
   // pakai fungsi dari Array.map()
   // membuat array baru dengan
   // me return kan value baru di setiap element array tersebut
   let test =  this.firebaseDatabase
      .list('/person')
      .snapshotChanges()
      .map((snapshotActionArr)=>{
          return snapshotActionArr.map((mapValue)=>{
              return {
                key : mapValue.key,
                personNama : mapValue.payload.child('person-name').val(),
                personPass : mapValue.payload.child('person-pass').val()
              }
          })
      });
   test.subscribe((next)=>{
      console.log(next);
   });



    this.usersList = this.firebaseDatabase
      .list('/person')
      .valueChanges();
  }



  ngOnInit(): void {
    this.retrieveData();
  }
}
