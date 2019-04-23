console.log('maf.js loaded')

maf={
    dir:{}
}

maf.ui=function(div){
    maf.div=div||document.getElementById('mafDiv')
    if(maf.div){
        console.log('mafDiv found')
        let h = '<p>Portable <a href="https://docs.gdc.cancer.gov/Data/File_Formats/maf_Format/" target="_blank">maf</a> API at <a href="https://www.github.com/episphere/maf" target="_blank"> Episphere</a> is loaded.</p>'
        h += ' <p id="mafInfo">Information on how to use it can be found <a href="https://github.com/episphere/maf/wiki" target="_blank">here</a>.</span></p>'
        maf.div.innerHTML=h
    }
}

maf.load=function(url){ // reading from a url on a web browser
    return new Promise(function(resolve,reject){
        fetch(url,{
            mode:'no-cors'
        }).then(resp=>{
            resp.text().then(txt=>{
                resolve(maf.txt2json(txt,url))
            })
        })
    })
}

maf.txt2json=(txt,url)=>{
    let m={
        head:{},
        body:{},
    }
    if(url){
        m.head.loaded_from=url
        m.head.loaded_at=Date()
    }
    let lines = txt.split(/\n/g)
    let headLines = lines.filter(L=>L[0]=='#')
    let bodyLines = lines.filter(L=>L[0]!='#')
    headLines.forEach(L=>{
        //console.log(L)
        let LL = L.slice(1).split(/\s/g)
        if(LL[1].match(',')){
            m.head[LL[0]]=LL[1].split(',')
        }else{
            m.head[LL[0]]=LL[1]
        }
    })
    let attr = bodyLines[0].split(/\t/g)

    attr.forEach(a=>{
        m.body[a]=[]
    })
    bodyLines.slice(1).forEach((vv,i)=>{
        vv.split(/\t/g).forEach((v,j)=>{
            m.body[attr[j]][i]=v
        })
    })
    return m
}

maf.getByValue=function(m,val,attr){ // default is get by case_id, where missing attr is assigned to that attribute, val can also be a function
    if(m.body.case_id){
        attr=attr||'case_id'
    }
    let vv = []
    let aa = Object.keys(m.body)
    if(typeof(val)=='function'){
        const n = m.body[aa[0]].length
        const ii = [...Array(n)].map((_,i)=>i)
        ii.forEach(i=>{
            let vi={}
            aa.forEach(a=>{
                vi[a]=m.body[a][i]
            })
            if(val(vi)){
                vv.push(vi)
            }
        })
    }else{
        m.body[attr].forEach((v,i)=>{
            if(v==val){
                let vi={}
                aa.forEach(a=>{
                    vi[a]=m.body[a][i]
                })
                vv.push(vi)
            }
        })
    }
    return vv
}


maf.loaded_at=Date()

if(typeof(window)!='undefined'){ // if this is running in the browser
    window.onload=function(){
        maf.ui()
        if(location.hash.match(/[#&](maf=[^&]+)/)){
            let url = location.hash.match(/[#&](maf=[^&]+)/)[1].split('=')[1]
            maf.load(url).then(m=>{
                maf.dir[url]=m
            })
        }
    }
}

if(typeof(module)!="undefined"){ // if this is been required
    console.log('maf required at '+Date())
    module.exports=maf
}

if(typeof(define)!="undefined"){ // if this is been required
    console.log('maf defined at '+Date())
    define(maf)
}

/*
NOTES

http://localhost:8000/maf/#maf=TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt
m = await (new maf).load('TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt')
m.getByValue('ecdd0e44-0add-4a08-a3f8-ab2f51df7afd')
m.getByValue(d=>(d.case_id=='ecdd0e44-0add-4a08-a3f8-ab2f51df7afd'))

x = (await (new maf).load('TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt')).getByValue('ecdd0e44-0add-4a08-a3f8-ab2f51df7afd')

x = (await (new maf).load('TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt')).getByValue(d=>(d.case_id=='ecdd0e44-0add-4a08-a3f8-ab2f51df7afd'))

m = new maf
await m.load('TCGA.PAAD.mutect.fea333b5-78e0-43c8-bf76-4c78dd3fac92.DR-10.0.somatic.maf.txt')


*/