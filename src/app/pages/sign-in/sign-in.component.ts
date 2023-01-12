import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CandidatesService } from '@core/services/candidates.service';
import { UsersService } from '@core/services/users.service';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { NGXLogger } from 'ngx-logger';



@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  returnUrl: string | undefined;

  constructor(
    private logger: NGXLogger,
    private route: ActivatedRoute, 
    public router: Router,
    public authService: AuthService,
    private usersService: UsersService,
    private candidatesService: CandidatesService
  ) { 
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  handleEmailSignIn(email: string, password: string) {
    this.logger.debug(`handleEmailSignIn...`, email, password);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        this.logger.debug(`handleEmailSignIn: User signed in!`);
        this.logger.debug(`handleEmailSignIn: Credential and user`, credential, credential.user);
        this.checkUser(credential.user.uid);
        this.router.navigate([this.returnUrl]);
      })
      .catch((error) => {
        this.logger.error(`handleEmailSignIn: Login Failed!`, error.code, error.message);
      })
  }

  handleAppleSignIn() {
  }

  handleGoogleSignIn() {
    this.logger.debug(`handleGoogleSignIn...`)
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        this.logger.debug(`handleGoogleSignIn: Logged in!`);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        this.logger.debug(`handleGoogleSignIn: Credential and user`, credential, user);
        this.checkUser(user.uid);
        this.router.navigate([this.returnUrl]);
      })
      .catch((error) => {
        this.logger.error(`handleGoogleSignIn: Login Failed!`, error.code, error.message);
        const credential = GoogleAuthProvider.credentialFromError(error);
        const user = error.email;
        this.logger.debug(`handleGoogleSignIn: Credential and user`, credential, user);
      })
  }

  checkUser(userId: string) {
    this.logger.debug('checkUser...', userId);
    this.candidatesService.getCurrentCandidate()
    //this.usersService.getUser(userId)
      .subscribe({
        next: (user) => {
          this.logger.debug('checkUser: Candidate exists!');
        },
        error: (error) => {
          const httpError = error as HttpErrorResponse;
          if (httpError.status == 404) {
            this.logger.debug('checkUser: Candidate does NOT exist!');
            this.router.navigate(['register']);
          }
        }
      });
  }
}
