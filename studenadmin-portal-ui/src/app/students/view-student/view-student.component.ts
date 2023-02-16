import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Gender } from 'src/app/models/api-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  }
  isNewStudent=false;
  header='';
  displayProfileImageUrl = '';
  genderList: Gender[]=[]

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderServive:GenderService,
    private snackbar:MatSnackBar,
    private router:Router
    ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if (this.studentId) {
          //if the route contain key word add
          if(this.studentId.toLowerCase()==='Add'.toLowerCase()){
            this.isNewStudent=true;
            this.header='Add new Student'
            this.setImage();
          }
          else{
            this.isNewStudent=false;
            this.header='Edit new Student';
            this.studentService.getStudent(this.studentId)
            .subscribe(
              (successResponse) => {
                this.student = successResponse;
                this.setImage();
              },
              (errorResponse) => {
                this.setImage();
              }
            );
          }



            this.genderServive.getGenderList()
            .subscribe(
              (successResponse)=>{
                this.genderList=successResponse;
              }
            )
        }
      }
    );
  }
  onUpdate():void{
    //call student service to update
    this.studentService.updateStudent(this.student.id,this.student)
    .subscribe(
      (successResponse)=>{
        //show notification
        this.snackbar.open('Student updated successfully',undefined,{
          duration:2000
        });
        setTimeout(() => {
          this.router.navigateByUrl('students');
     }, 2000);


      },
      (errorResponse)=>{
        //log it
      }
    )
  }
  onDelete():void{
    //student service to delete
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      (successResponse)=>{
        this.snackbar.open('Student deleted succesfully',undefined,{
          duration:2000
        });
        setTimeout(() => {
             this.router.navigateByUrl('students');
        }, 2000);

      },
      (errorResponse)=>{
        console.log(errorResponse);
      }
    )
  }
  onAdd():void{
    this.studentService.addStudent(this.student)
    .subscribe(
      (successReponse)=>{
        this.snackbar.open('Student added successfully',undefined,{
          duration:2000
        });
        setTimeout(() => {
          this.router.navigateByUrl(`students/${successReponse.id}`);
     }, 2000);

      },
      (errorResponse)=>{

      }
    )
  }
  uploadImage(event: any): void {
    if (this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
        .subscribe(
          (successResponse) => {
            this.student.profileImageUrl = successResponse;
            this.setImage();

            // Show a notification
            this.snackbar.open('Profile Image Updated', undefined, {
              duration: 2000
            });

          },
          (errorResponse) => {

          }
        );

    }

  }

  private setImage(): void {
    if (this.student.profileImageUrl) {
      this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);
    } else {
      // Display a default
      this.displayProfileImageUrl = '/assets/user.png';
    }
  }
}
