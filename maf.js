console.log('maf.js loaded')

MAF=function(){
    //ini
    console.log(' MAF prototype instatiated (OO types can think of it as a class) ')

this.created_at=Date()

this.load=function(url){ // reading from a url on a web browser
    this.url=url||MAF.url
    let that=this
    return new Promise(function(resolve,reject){
        fetch(that.url).then(resp=>{
            resp.text().then(txt=>{
                resolve(that.txt2json(txt))
            })
        })
    })
}

this.txt2json=txt=>{
    this.head={}
    this.body={}
    let lines = txt.split(/\n/g)
    let headLines = lines.filter(L=>L[0]=='#')
    let bodyLines = lines.filter(L=>L[0]!='#')
    headLines.forEach(L=>{
        //console.log(L)
        let LL = L.slice(1).split(/\s/g)
        if(LL[1].match(',')){
            this.head[LL[0]]=LL[1].split(',')
        }else{
            this.head[LL[0]]=LL[1]
        }
    })
    return this
}

}

MAF.loaded_at=Date()

if(typeof(window)!='undefined'){ // if this is running in the browser
    window.onload=function(){
        MAF.div=document.getElementById('mafDiv')
        if(MAF.div){
            let h = '<p>Portable <a href="https://docs.gdc.cancer.gov/Data/File_Formats/MAF_Format/" target="_blank">maf</a> API at <a href="https://www.github.com/episphere/maf" target="_blank"> Episphere</a> loaded.'
            h += ' <span id="mafInfo">Information on how to use it can be found <a href="https://github.com/episphere/maf/wiki" target="_blank">here</a>.</span></p>'
            MAF.div.innerHTML=h
        }

        if(location.hash.match(/[#&](maf=[^&]+)/)){
            MAF.url = location.hash.match(/[#&](maf=[^&]+)/)[1].split('=')[1]
        }
    }
}

if(typeof(module)!="undefined"){ // if this is been required
    console.log('MAF required at '+Date())
    module.exports=MAF
}

/*
NOTES

http://localhost:8000/maf/#maf=TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt


*/