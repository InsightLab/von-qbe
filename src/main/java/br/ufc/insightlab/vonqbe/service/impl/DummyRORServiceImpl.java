package br.ufc.insightlab.vonqbe.service.impl;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.ror.entities.ResultQuerySet;
import br.ufc.insightlab.vonqbe.service.RORService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class DummyRORServiceImpl implements RORService {

    private class FileResultQuerySet extends ResultQuerySet {

        FileResultQuerySet(){
            super(null,null);
        }

        private List<ResultQuery> getfromFile() {
            List<ResultQuery> list = new ArrayList<>();

            try {
                List<String> lines = Files.readAllLines(Paths.get("src/main/resources/dummyQueryResults.tsv"));
                String[] header = lines.remove(0).split("\t");

                for(String line : lines) {
                    ResultQuery result = new ResultQuery(0);
                    int i = 0;
                    for(String field : line.split("\t")) {
                        if(field.startsWith("http"))
                            field = "<"+field+">";
                        if(field.equals(""))
                            field = " ";
                        result.addValue(header[i], field);
                        i += 1;
                    }

                    list.add(result);
                }

            } catch (IOException e) {
                e.printStackTrace();
            }


            return list;
        }

        @Override
        public Iterator<ResultQuery> iterator() {
            return getfromFile().iterator();
        }
    }


    @Override
    public ResultQuerySet run(String sparql) {
        return new FileResultQuerySet();
    }
}
