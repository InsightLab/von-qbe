package br.ufc.insightlab.vonqbe.model;

public class ReturnListFilesUpload {
	
	public String name;
	
	public UploadFileResponse file1;
	
	public UploadFileResponse file2;
	

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public UploadFileResponse getFile1() {
		return file1;
	}
	public void setFile1(UploadFileResponse file1) {
		this.file1 = file1;
	}
	public UploadFileResponse getFile2() {
		return file2;
	}
	public void setFile2(UploadFileResponse file2) {
		this.file2 = file2;
	}
	

}
