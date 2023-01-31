import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CandidatesService } from '@core/services/candidates.service';
import { UsersService } from '@core/services/users.service';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from 'firebase/auth';
import { NGXLogger } from 'ngx-logger';
import { combineLatest, first, forkJoin, pipe } from 'rxjs';



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
        this.checkUser('');
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
        this.checkUser(credential?.idToken);
        this.router.navigate([this.returnUrl]);
      })
      .catch((error) => {
        this.logger.error(`handleGoogleSignIn: Login Failed!`, error.code, error.message);
        const credential = GoogleAuthProvider.credentialFromError(error);
        const user = error.email;
        this.logger.debug(`handleGoogleSignIn: Credential and user`, credential, user);
      })
  }

  checkUser(idToken?: string) {
    this.logger.debug('checkUser...', idToken);
    forkJoin({
      accountInfo: this.usersService.getUserInfo(),
      candidate: this.candidatesService.getCurrentCandidate(),
    }).subscribe({
      next: ({accountInfo, candidate}) => {
        this.logger.info('checkUser:', accountInfo, candidate);
      },
      error: (error) => {
        this.logger.error('checkUser: Oh, CRAP!', error);
      }
    });
  }
}
