import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';



@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  returnUrl: string | undefined;

  constructor(
    private route: ActivatedRoute, 
    public router: Router,
    public authService: AuthService
  ) { 
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  handleEmailSignIn(email: string, password: string) {
    console.debug(`[DEBUG] handleEmailSignIn...`, email, password);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.debug(`[DEBUG] User signed in!`);
        this.router.navigate([this.returnUrl]);
      })
      .catch((error) => {
        console.error(`[ERROR] Login Failed!`, error.code, error.message);
      })
  }

  handleAppleSignIn() {
  }

  handleGoogleSignIn() {
    console.debug(`[DEBUG] Google sign in...`)
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.debug(`[DEBUG] Logged in!`);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.debug(`[DEBUG] Credential and user`, credential, user);
        this.router.navigate([this.returnUrl]);
      })
      .catch((error) => {
        console.error(`[ERROR] Login Failed!`, error.code, error.message);
        const credential = GoogleAuthProvider.credentialFromError(error);
        const user = error.email;
        console.debug(`[DEBUG] Credential and user`, credential, user);
      })
  }


}
