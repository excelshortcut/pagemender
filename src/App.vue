<template>
  <div id="app" class="app-container">
    <h1>WordSnap</h1>

    <div v-if="!authenticated">
      <p>Enter Password:</p>
      <input type="password" v-model="inputPassword" />
      <button @click="checkPassword">Login</button>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </div>

    <div v-else>
      <div class="drop-zone" @dragover.prevent="onDragOver" @drop.prevent="onDrop($event, 'doc1')">
        <p v-if="!doc1File">Drag & Drop Document 1 Here</p>
        <p v-else>{{ doc1File.name }} uploaded</p>
      </div>
      <div class="drop-zone" @dragover.prevent="onDragOver" @drop.prevent="onDrop($event, 'doc2')">
        <p v-if="!doc2File">Drag & Drop Document 2 Here</p>
        <p v-else>{{ doc2File.name }} uploaded</p>
      </div>
      <button @click="mergeDocuments" :disabled="!doc1File || !doc2File || merging">Combine Documents</button>
      <p v-if="merging">Merging in progress...</p>
      <p v-if="mergedFile">
        Merge complete! <a :href="mergedFile" download="combined.docx">Download Combined File</a>
      </p>
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
      mergedFile: null
    };
  },
  methods: {
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

      // Extract paragraphs content
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
        // Extract content from both documents
        const [doc1Content, doc2Content] = await Promise.all([
          this.extractDocContent(this.doc1File),
          this.extractDocContent(this.doc2File)
        ]);

        // Create new document with proper initialization
        const doc = new Document({
          creator: "WordSnap",
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

        // Generate the merged document
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

<style>
.app-container {
  padding: 16px;
  font-family: sans-serif;
}
.drop-zone {
  border: 2px dashed #ccc;
  margin: 16px 0;
  padding: 16px;
  text-align: center;
}
</style>
