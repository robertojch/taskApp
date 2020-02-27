import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Task } from 'src/app/model/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [
    trigger('fade', [

      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(200, style({ opacity: 1, transform: 'translateY(0px)' }))
      ]),

      transition(':leave', [
        animate(200, style({ opacity: 0, transform: 'translateY(30px)' }))
      ]),

    ])
  ]
})
export class TaskListComponent {

  taskDescription = '';
  previousDescription = '';
  constructor(public taskService: TaskService) { }

  addTask(): void {
    if (this.taskDescription.trim().length === 0) {
      return;
    }
    this.taskService.addTask(this.taskDescription);
    this.taskDescription = '';
  }

  editMode(task: Task): void {
    this.previousDescription = task.description;
    task.editing = true;
  }

  updateTask(task: Task): void {
    if (task.description.trim().length === 0) {
      task.description = this.previousDescription;
    }

    if (task.description !== this.previousDescription) {
      this.taskService.updateTask(task).subscribe(response => {
        this.previousDescription = '';
      });
    }

    task.editing = false;
  }


  cancelEdit(task: Task): void {
    task.description = this.previousDescription;
    task.editing = false;
    this.previousDescription = '';
  }

}
