package br.ufc.insightlab.vonqbe.model;

public class ReturnVirtuosoUpload {

    public String name;

    public String linkURL;

    public String baseURI;

    public UploadFileResponse squema;

    public ReturnVirtuosoUpload() {
    }

    public ReturnVirtuosoUpload(String name, String linkURL, String baseURI, UploadFileResponse squema) {
        this.name = name;
        this.linkURL = linkURL;
        this.baseURI = baseURI;
        this.squema = squema;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLinkURL() {
        return linkURL;
    }

    public void setLinkURL(String linkURL) {
        this.linkURL = linkURL;
    }

    public String getBaseURI() {
        return baseURI;
    }

    public void setBaseURI(String baseURI) {
        this.baseURI = baseURI;
    }

    public UploadFileResponse getSquema() {
        return squema;
    }

    public void setSquema(UploadFileResponse squema) {
        this.squema = squema;
    }
}
