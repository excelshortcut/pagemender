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
        <!-- Tool interface preview (locked state) -->
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
              action="https://excelshortcut.us20.list-manage.com/subscribe/post?u=753605d7a4378f7975e2f4941&id=01779f56c2&tags=pagemenderps"
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

              <input type="text" name="MMERGE7" placeholder="Enter source" />

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
        <!-- Document 1 Drop Zone -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
          @dragover.prevent="onDragOver"
          @drop.prevent="onDrop($event, 'doc1')"
        >
          <p v-if="!doc1File" class="text-gray-500">Drag & Drop Document 1 Here</p>
          <p v-else class="text-gray-700">{{ doc1File.name }} uploaded</p>
        </div>

        <!-- Document 2 Drop Zone -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
          @dragover.prevent="onDragOver"
          @drop.prevent="onDrop($event, 'doc2')"
        >
          <p v-if="!doc2File" class="text-gray-500">Drag & Drop Document 2 Here</p>
          <p v-else class="text-gray-700">{{ doc2File.name }} uploaded</p>
        </div>

        <!-- Document 3 Drop Zone (New addition) -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
          @dragover.prevent="onDragOver"
          @drop.prevent="onDrop($event, 'doc3')"
        >
          <p v-if="!doc3File" class="text-gray-500">Drag & Drop Document 3 Here (Optional)</p>
          <p v-else class="text-gray-700">{{ doc3File.name }} uploaded</p>
        </div>

        <!-- Combine Documents Button and Feedback -->
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

      <!-- Feedback Form (Visible when authenticated) -->
      <div class="mt-12 bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Have feedback or encountered an issue?</h2>
        <p class="text-gray-600 mb-8">We value your feedback. Please provide as much detail as possible.</p>

        <p v-if="feedbackError" class="text-red-500 mb-4">{{ feedbackError }}</p>
        <p v-if="feedbackSuccess" class="text-green-500 mb-4">{{ feedbackSuccess }}</p>

        <form @submit.prevent="submitFeedback" class="space-y-4">
          <div>
            <label for="issueType" class="block mb-2 font-semibold text-gray-700">Type of Issue</label>
            <select
              id="issueType"
              v-model="feedbackType"
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Bug">Bug</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Feedback">Feedback</option>
            </select>
          </div>

          <div>
            <label for="feedbackNote" class="block mb-2 font-semibold text-gray-700">Feedback</label>
            <textarea
              id="feedbackNote"
              v-model="feedbackNote"
              rows="6"
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your issue or provide feedback..."
            ></textarea>
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Attachment (Optional)</label>
            <p class="text-sm text-gray-500 mb-2">Attach screenshot or supporting file (max 2MB)</p>
            <input
              ref="fileInput"
              type="file"
              accept="image/png,image/jpeg,image/jpg,application/pdf"
              @change="handleFileUpload"
              class="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="text-right">
            <button
              type="submit"
              :disabled="feedbackSubmitting"
              class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              <span v-if="feedbackSubmitting">Submitting...</span>
              <span v-else>Submit Feedback</span>
            </button>
          </div>
        </form>
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
      doc3File: null, // New file state for third document
      merging: false,
      mergedFile: null,

      // Feedback form state
      feedbackType: 'Feedback',
      feedbackNote: '',
      feedbackFile: null,
      feedbackSubmitting: false,
      feedbackError: '',
      feedbackSuccess: '',
    };
  },
  methods: {
    checkPassword() {
      if (this.inputPassword === this.correctPassword) {
        this.authenticated = true;
        this.errorMessage = '';
        this.$nextTick(() => window.scrollTo(0, 0));
      } else {
        this.errorMessage = 'Incorrect password.';
      }
    },
    onDragOver(event) {
      event.dataTransfer.dropEffect = 'copy';
    },
    onDrop(event, docTarget) {
      const files = event.dataTransfer.files;
      if (
        files.length > 0 &&
        files[0].type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        if (docTarget === 'doc1') {
          this.doc1File = files[0];
        } else if (docTarget === 'doc2') {
          this.doc2File = files[0];
        } else if (docTarget === 'doc3') {
          this.doc3File = files[0];
        }
      } else {
        alert('Please drop a valid Word (.docx) file.');
      }
    },
    async mergeDocuments() {
      if (!this.doc1File || !this.doc2File) return;
      this.merging = true;

      try {
        const [doc1Content, doc2Content, doc3Content] = await Promise.all([
          this.extractDocContent(this.doc1File),
          this.extractDocContent(this.doc2File),
          this.doc3File ? this.extractDocContent(this.doc3File) : Promise.resolve([])
        ]);

        const paragraphs = [
          ...doc1Content.map((text) => new Paragraph({ children: [new TextRun({ text })] })),
          new Paragraph({ children: [new TextRun({ text: '', break: true })] }),
          ...doc2Content.map((text) => new Paragraph({ children: [new TextRun({ text })] })),
        ];

        if (doc3Content.length > 0) {
          paragraphs.push(new Paragraph({ children: [new TextRun({ text: '', break: true })] }));
          paragraphs.push(...doc3Content.map((text) => new Paragraph({ children: [new TextRun({ text })] })));
        }

        const doc = new Document({
          creator: 'PageMender',
          description: 'Merged document',
          title: 'Combined Document',
          sections: [{ properties: {}, children: paragraphs }],
        });

        const blob = await Packer.toBlob(doc);
        this.mergedFile = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error merging documents:', error);
        this.mergeError = 'An error occurred while merging documents.';
        alert('An error occurred while merging documents.');
      } finally {
        this.merging = false;
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
        .map((p) => {
          const textElements = p.getElementsByTagName('w:t');
          return Array.from(textElements)
            .map((t) => t.textContent)
            .join('')
            .trim();
        })
        .filter((text) => text);
    },
    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.size > 2 * 1024 * 1024) {
        this.feedbackError = 'File size exceeds 2MB. Please choose a smaller file.';
        event.target.value = '';
        this.feedbackFile = null;
      } else {
        this.feedbackError = '';
        this.feedbackFile = file || null;
      }
    },
    async submitFeedback() {
      this.feedbackError = '';
      this.feedbackSuccess = '';

      if (!this.feedbackNote.trim()) {
        this.feedbackError = 'Please provide some feedback or details.';
        return;
      }

      const formData = new FormData();
      formData.append('type', this.feedbackType);
      formData.append('note', this.feedbackNote);

      if (this.feedbackFile) {
        formData.append('attachment', this.feedbackFile, this.feedbackFile.name);
      }

      this.feedbackSubmitting = true;

      try {
        const response = await fetch('https://api.pagemender.com/api/feedback/form', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.detail || 'Failed to submit feedback');
        }

        this.feedbackSuccess = 'Thank you for your feedback!';
        this.feedbackType = 'Bug';
        this.feedbackNote = '';
        this.feedbackFile = null;

        // Reset file input using querySelector
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';

      } catch (error) {
        console.error('Error submitting feedback:', error);
        this.feedbackError = error.message || 'Failed to submit feedback. Please try again.';
      } finally {
        this.feedbackSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
/* Additional styling can be placed here if needed */
</style>
