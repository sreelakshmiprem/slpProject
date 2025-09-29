import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Chatbotservice } from '../chatbotservice';
import { Footer } from '../DashBoardmaterials/footer/footer';
import { Header } from '../DashBoardmaterials/header/header';
import { Sidebar } from '../DashBoardmaterials/sidebar/sidebar';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Header, Sidebar, Footer],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss'
})
export class Chatbot {
  private fb = inject(FormBuilder);
  private geminiService = inject(Chatbotservice);

  chatForm!: FormGroup;
  chatHistory: any[] = [];
  loading = false;

  ngOnInit() {
    this.chatForm = this.fb.group({
      prompt: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.geminiService.getMessageHistory().subscribe((res) => {
      if (res) {
        this.chatHistory.push(res);
      }
    });
  }

  async sendData() {
    if (this.chatForm.invalid || this.loading) return;

    this.loading = true;
    const userInput = this.chatForm.value.prompt;
    this.chatForm.reset();

    await this.geminiService.generateText(userInput);
    this.loading = false;
  }

  formatText(text: string) {
    return text.replaceAll('*', '');
  }
}
