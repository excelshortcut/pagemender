<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Landing Page (shown when not authenticated) -->
    <div v-if="!authenticated" class="max-w-6xl mx-auto px-4">
      <!-- Navigation -->
      <nav class="py-4 border-b border-gray-200">
        <div class="text-2xl font-bold text-gray-800">PageMender</div>
      </nav>

      <!-- Hero Section -->
      <div class="text-center py-16">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">PageMender</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          A powerful document merging tool that combines your Word documents seamlessly.
          Perfect for combining reports, contracts, and documentation.
        </p>
      </div>

      <!-- Tool Preview Section -->
      <div class="relative max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-16">
        <!-- Preview UI -->
        <div class="opacity-50">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <p class="text-gray-500">Drag & Drop Document 1 Here</p>
          </div>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <p class="text-gray-500">Drag & Drop Document 2 Here</p>
          </div>
          <button class="bg-blue-500 text-white px-6 py-2 rounded-md opacity-50 cursor-not-allowed">
            Combine Documents
          </button>
        </div>

        <!-- Lock Overlay -->
        <div class="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex flex-col items-center justify-center">
          <div class="text-6xl mb-4">🔒</div>
          <p class="text-xl font-semibold text-gray-800">Tool Access Protected</p>
          <p class="text-gray-600">Subscribe below to gain access</p>
        </div>
      </div>

      <!-- Authentication Section -->
      <div class="max-w-2xl mx-auto text-center py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Get Access to PageMender</h2>

        <!-- Password Input -->
        <div class="mb-8 p-6 bg-white rounded-lg shadow-sm">
          <p class="text-lg text-gray-600 mb-4">Already have a password?</p>
          <div class="flex gap-4 justify-center">
            <input
              type="password"
              v-model="inputPassword"
              placeholder="Enter password"
              class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="checkPassword"
              class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          </div>
          <p v-if="errorMessage" class="mt-2 text-red-500">{{ errorMessage }}</p>
        </div>

        <!-- Email Signup -->
        <div class="mt-8">
          <p class="text-lg text-gray-600 mb-8">
            Don't have access? Subscribe to Data Accelerator Newsletter to receive your password
          </p>
          <div class="flex gap-4 mb-4">
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email address"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': emailError }"
            />
            <button
              @click="submitEmail"
              :disabled="isSubmitting"
              class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {{ isSubmitting ? 'Subscribing...' : 'Get Access' }}
            </button>
          </div>

          <p v-if="emailError" class="text-red-500 mb-4">{{ emailError }}</p>
          <p v-if="subscriptionSuccess" class="text-green-500 mb-4">
            Thank you for subscribing! Check your email for the access password.
          </p>

          <!-- Benefits -->
          <div class="bg-gray-50 rounded-lg p-6 mt-8 text-left">
            <div class="space-y-3">
              <p class="text-gray-700">✓ Instant access to PageMender</p>
              <p class="text-gray-700">✓ Weekly data insights and tools</p>
              <p class="text-gray-700">✓ Document management tips and best practices</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tool Interface (shown when authenticated) -->
    <div v-else class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">PageMender</h1>

      <div class="space-y-4">
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
          @dragover.prevent="onDragOver"
          @drop.prevent="onDrop($event, 'doc1')"
        >
          <p v-if="!doc1File" class="text-gray-500">Drag & Drop Document 1 Here</p>
          <p v-else class="text-gray-700">{{ doc1File.name }} uploaded</p>
        </div>

        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
          @dragover.prevent="onDragOver"
          @drop.prevent="onDrop($event, 'doc2')"
        >
          <p v-if="!doc2File" class="text-gray-500">Drag & Drop Document 2 Here</p>
          <p v-else class="text-gray-700">{{ doc2File.name }} uploaded</p>
        </div>

        <div class="text-center">
          <button
            @click="mergeDocuments"
            :disabled="!doc1File || !doc2File || merging"
            class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Combine Documents
          </button>

          <p v-if="merging" class="mt-4 text-gray-600">Merging in progress...</p>
          <p v-if="mergedFile" class="mt-4">
            Merge complete!
            <a
              :href="mergedFile"
              download="combined.docx"
              class="text-blue-500 hover:text-blue-600"
            >
              Download Combined File
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Document, Paragraph, Packer, TextRun } from 'docx';
import JSZip from 'jszip';

export default {
  data() {
    return {
      correctPassword: 'mySecretPassword',
      inputPassword: '',
      authenticated: false,
      errorMessage: '',
      doc1File: null,
      doc2File: null,
      merging: false,
      mergedFile: null,
      email: '',
      emailError: '',
      isSubmitting: false,
      subscriptionSuccess: false
    };
  },
  methods: {
    async submitEmail() {
      if (!this.email) {
        this.emailError = 'Please enter your email address';
        return;
      }
      if (!this.validateEmail(this.email)) {
        this.emailError = 'Please enter a valid email address';
        return;
      }

      this.isSubmitting = true;
      this.emailError = '';

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.subscriptionSuccess = true;
        this.email = '';
        // In real implementation, send password via email
        this.authenticated = true; // For demo, auto-authenticate
      } catch (error) {
        this.emailError = 'Failed to subscribe. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    checkPassword() {
      if (this.inputPassword === this.correctPassword) {
        this.authenticated = true;
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Incorrect password.';
      }
    },
    onDragOver(event) {
      event.dataTransfer.dropEffect = 'copy';
    },
    onDrop(event, docTarget) {
      const files = event.dataTransfer.files;
      if (files.length > 0 && files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        if (docTarget === 'doc1') {
          this.doc1File = files[0];
        } else {
          this.doc2File = files[0];
        }
      } else {
        alert('Please drop a valid Word (.docx) file.');
      }
    },
    async extractDocContent(file) {
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      const zip = new JSZip();
      const contents = await zip.loadAsync(arrayBuffer);
      const documentXml = await contents.file('word/document.xml').async('text');

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(documentXml, 'text/xml');
      const paragraphs = xmlDoc.getElementsByTagName('w:p');

      return Array.from(paragraphs)
        .map(p => {
          const textElements = p.getElementsByTagName('w:t');
          return Array.from(textElements)
            .map(t => t.textContent)
            .join('')
            .trim();
        })
        .filter(text => text);
    },
    async mergeDocuments() {
      if (!this.doc1File || !this.doc2File) return;
      this.merging = true;

      try {
        const [doc1Content, doc2Content] = await Promise.all([
          this.extractDocContent(this.doc1File),
          this.extractDocContent(this.doc2File)
        ]);

        const doc = new Document({
          creator: "PageMender",
          description: "Merged document",
          title: "Combined Document",
          sections: [{
            properties: {},
            children: [
              ...doc1Content.map(text => new Paragraph({
                children: [new TextRun({ text: text })]
              })),
              new Paragraph({
                children: [new TextRun({ text: "", break: true })]
              }),
              ...doc2Content.map(text => new Paragraph({
                children: [new TextRun({ text: text })]
              }))
            ]
          }]
        });

        const blob = await Packer.toBlob(doc);
        this.mergedFile = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error merging documents:', error);
        alert('An error occurred while merging documents.');
      } finally {
        this.merging = false;
      }
    },
    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    }
  }
};
</script>
