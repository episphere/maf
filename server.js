console.log('maf server.js loaded');

MAF = require('./maf.js')


testMaf=function(){
    const txt = fs.readFileSync('TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt','utf8')
    let m = new MAF
    return m.txt2json(txt)
    //return txt.length
}


lala = a=>2*a

debugger
