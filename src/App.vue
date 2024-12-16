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
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          <span class="font-semibold">Tired of copy-pasting between Word documents?</span><br>
          <span class="block mt-4">
            <strong>PageMender</strong> helps you effortlessly combine multiple Word documents into a single file.
          </span>
          <span class="block mt-4">
            Whether you're merging project reports, course materials, or research papers,
            our web-based tool helps you unify documents in seconds. ✨
          </span>
          <span class="block mt-4">
            Start merging your Word files now with <strong>PageMender</strong>.
            All you have to do is sign up for the Free "Data Accelerator" Newsletter and use the password
            provided in your Welcome Email.
          </span>
        </p>
      </div>

      <!-- Tool Preview Section -->
      <div class="relative max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-16">
        <!-- Tool interface preview -->
        <div>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <p class="text-gray-500">Drag & Drop Document 1 Here</p>
          </div>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <p class="text-gray-500">Drag & Drop Document 2 Here</p>
          </div>
          <!-- Combine button and lock on the same line -->
          <div class="flex items-center justify-center gap-4 mt-4">
            <button
              class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md cursor-not-allowed"
              disabled
            >
              Combine Documents
            </button>
            <div class="flex items-center gap-2 bg-white bg-opacity-90 p-2 rounded-md shadow pointer-events-none">
              <span class="text-xl">🔒</span>
              <div class="text-left">
                <p class="text-sm font-semibold text-gray-800">Tool Locked</p>
                <p class="text-xs text-gray-600">Enter password below to Unlock</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Transparent overlay to block interaction without obscuring view -->
        <div class="absolute inset-0 pointer-events-auto bg-transparent"></div>
      </div>

      <!-- Authentication Section -->
      <!--
        Stacked layout: "Unlock PageMender" section above the "No Access?" section.
        Both sections now have a uniform style and ensure the email input is contained within the card.
      -->
      <div class="max-w-2xl mx-auto text-center py-12">

        <!-- Unlock PageMender Card -->
        <div class="flex flex-col items-center bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Unlock PageMender</h2>
          <p class="text-lg text-gray-600 mb-4">Already have a password?</p>
          <div class="w-full max-w-md mx-auto">
            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <input
                type="password"
                v-model="inputPassword"
                placeholder="Enter password"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        <!-- No Access Card -->
        <div class="flex flex-col items-center bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">No Access?</h2>
          <p class="text-lg text-gray-600 mb-8 text-center">
            Subscribe to the Free Data Accelerator Newsletter to receive your password.
          </p>
          <div class="w-full max-w-md mx-auto">
            <!-- Begin Mailchimp Signup Form -->
            <form
              action="https://excelshortcut.us20.list-manage.com/subscribe/post?u=753605d7a4378f7975e2f4941&id=01779f56c2"
              method="post"
              target="_blank"
              novalidate
              class="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <input
                type="email"
                name="EMAIL"
                placeholder="Enter your email address"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="submit"
                value="Get Access"
                name="subscribe"
                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
              />
            </form>
            <!--End mc_embed_signup-->

            <div id="mce-responses" class="clear w-full text-left mt-4">
              <div class="response" id="mce-error-response" style="display:none;"></div>
              <div class="response" id="mce-success-response" style="display:none;"></div>
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
/*
  Overview:
  This Vue component manages both locked (unauthenticated) and unlocked (authenticated) states.
  Users either enter a password or subscribe to access. Once unlocked, they can drag & drop .docx
  files and merge them.

  Modular Functions:
  - checkPassword: Validate input password
  - onDragOver, onDrop: Handle drag & drop file inputs
  - mergeDocuments: Combine two .docx files into one
  - extractDocContent, readFileAsArrayBuffer: Utility to read and parse .docx files

  Clean Code:
  - Meaningful naming
  - Comments explain code intent
  - Modular, reusable functions
*/

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
    };
  },
  methods: {
    // Check entered password against correct password
    checkPassword() {
      if (this.inputPassword === this.correctPassword) {
        this.authenticated = true;
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Incorrect password.';
      }
    },

    // Allow drop action (copy)
    onDragOver(event) {
      event.dataTransfer.dropEffect = 'copy';
    },

    // Handle dropped file, assign to either doc1 or doc2
    onDrop(event, docTarget) {
      const files = event.dataTransfer.files;
      if (
        files.length > 0 &&
        files[0].type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        if (docTarget === 'doc1') {
          this.doc1File = files[0];
        } else {
          this.doc2File = files[0];
        }
      } else {
        alert('Please drop a valid Word (.docx) file.');
      }
    },

    // Merge two documents into a single file
    async mergeDocuments() {
      if (!this.doc1File || !this.doc2File) return;
      this.merging = true;

      try {
        const [doc1Content, doc2Content] = await Promise.all([
          this.extractDocContent(this.doc1File),
          this.extractDocContent(this.doc2File),
        ]);

        const doc = new Document({
          creator: 'PageMender',
          description: 'Merged document',
          title: 'Combined Document',
          sections: [
            {
              properties: {},
              children: [
                ...doc1Content.map(
                  (text) =>
                    new Paragraph({
                      children: [new TextRun({ text })],
                    })
                ),
                // Add a blank paragraph (line break) between documents
                new Paragraph({ children: [new TextRun({ text: '', break: true })] }),
                ...doc2Content.map(
                  (text) =>
                    new Paragraph({
                      children: [new TextRun({ text })],
                    })
                ),
              ],
            },
          ],
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

    // Extract text from a .docx file
    async extractDocContent(file) {
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      const zip = new JSZip();
      const contents = await zip.loadAsync(arrayBuffer);
      const documentXml = await contents.file('word/document.xml').async('text');

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(documentXml, 'text/xml');
      const paragraphs = xmlDoc.getElementsByTagName('w:p');

      return Array.from(paragraphs)
        .map((p) => {
          const textElements = p.getElementsByTagName('w:t');
          return Array.from(textElements)
            .map((t) => t.textContent)
            .join('')
            .trim();
        })
        .filter((text) => text);
    },

    // Read file as ArrayBuffer for parsing .docx
    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    },
  },
};
</script>

<style scoped>
/* Additional styling can be placed here if needed */
</style>
