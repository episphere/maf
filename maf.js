console.log('maf.js loaded')

MAF=function(url){
    //ini
    console.log(' MAF prototype instatiated at'+Date())   

this.created_at=Date()

this.load=function(url){ // reading from a url on a web browser
    this.url=url||MAF.url
    let that=this
    return new Promise(function(resolve,reject){
        fetch(that.url,{
            mode:'no-cors'
        }).then(resp=>{
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
    let attr = bodyLines[0].split(/\t/g)

    //this.bodyLines=bodyLines
    this.body={}
    attr.forEach(a=>{
        this.body[a]=[]
    })
    bodyLines.slice(1).forEach((vv,i)=>{
        vv.split(/\t/g).forEach((v,j)=>{
            this.body[attr[j]][i]=v
        })
    })
    return this
}

this.getByValue=function(val,attr){ // default is get by case_id, where missing attr is assigned to that attribute, val can also be a function
    if(this.body.case_id){
        attr=attr||'case_id'
    }
    let vv = []
    let aa = Object.keys(this.body)
    if(typeof(val)=='function'){
        const n = this.body[aa[0]].length
        const ii = [...Array(n)].map((_,i)=>i)
        ii.forEach(i=>{
            let vi={}
            aa.forEach(a=>{
                vi[a]=this.body[a][i]
            })
            if(val(vi)){
                vv.push(vi)
            }
        })
    }else{
        this.body[attr].forEach((v,i)=>{
            if(v==val){
                let vi={}
                aa.forEach(a=>{
                    vi[a]=this.body[a][i]
                })
                vv.push(vi)
            }
        })
    }
    return vv
}

}

MAF.load=async function(url){ // reading from a url on a web browser
    return (await (new MAF).load(url))
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

if(typeof(define)!="undefined"){ // if this is been required
    console.log('MAF defined at '+Date())
    define({MAF:MAF})
}

/*
NOTES

http://localhost:8000/maf/#maf=TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt
m = await (new MAF).load('TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt')
m.getByValue('ecdd0e44-0add-4a08-a3f8-ab2f51df7afd')
m.getByValue(d=>(d.case_id=='ecdd0e44-0add-4a08-a3f8-ab2f51df7afd'))

x = (await (new MAF).load('TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt')).getByValue('ecdd0e44-0add-4a08-a3f8-ab2f51df7afd')

x = (await (new MAF).load('TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt')).getByValue(d=>(d.case_id=='ecdd0e44-0add-4a08-a3f8-ab2f51df7afd'))

m = new MAF
await m.load('TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt')


*/