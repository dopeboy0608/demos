// 실제 API 연동 시에도 이 함수는 그대로 두고, blob 생성 쪽(fetchZipcodeExcelBlob)만 교체한다.
export function downloadBlob(blob: Blob, fileName: string): void {
  const blobUrl = window.URL.createObjectURL(blob);
  const fileLink = document.createElement('a');
  fileLink.href = blobUrl;
  fileLink.download = fileName;
  fileLink.click();
  fileLink.remove();
  window.URL.revokeObjectURL(blobUrl);
}
