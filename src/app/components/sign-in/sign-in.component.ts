import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthProvider, GoogleAuthProvider } from '@firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  returnUrl: string | undefined;

  constructor(
    private auth: AngularFireAuth,
    private route: ActivatedRoute, 
    public router: Router
  ) { 
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('onAuthStateChanged: login complete! - redirecting...', this.returnUrl);
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  handleEmailSignIn(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }

  handleAppleSignIn() {
  }

  handleGoogleSignIn() {
    console.log("Google sign in...")
    this.handleSignIn(new GoogleAuthProvider());
  }

  handleSignIn(provider: AuthProvider) {
    this.auth.signInWithPopup(provider)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }
}
