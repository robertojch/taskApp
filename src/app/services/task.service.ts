import { Injectable } from '@angular/core';
import { Task } from '../model/task';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  taskDescription = '';
  tasks: Task[] = [];

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });


  constructor(private http: HttpClient) {
    this.tasks = this.getTasks();
  }

  getTasks() {

    this.http.get(API_URL + '/tasks')
      .pipe(catchError(this.errorHandler))
      .subscribe((response: any) => {
        this.tasks = response;
      });

    return this.tasks;
  }

  addTask(taskDescription: string): void {
    this.http.post<Task>(`${API_URL}/tasks/`,
      {
        description: taskDescription, status: false,
        editing: false
      }).subscribe(response => {
        this.tasks.push({
          id: response.id,
          description: taskDescription,
          status: false,
          editing: false
        });
      });

  }


  updateTask(task: Task) {
    return this.http.put(`${API_URL}/tasks/${task.id}`, {
      description: task.description,
      status: task.status,
      editing: false
    });

  }


  deleteTask(id: number): void {
    this.http.delete(`${API_URL}/tasks/${id}`, { headers: this.httpHeaders })
      .subscribe((response: any) => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      });
  }


  taskList(): Task[] {
    return this.tasks.sort(task => task.status ? 1 : -1);
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.message || 'Something went wrong!!!!');
  }

}
