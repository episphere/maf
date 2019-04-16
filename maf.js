

maf=function(){
    //ini
    console.log('maf.js initiatized')
    maf.div=document.getElementById('mafDiv')
    if(maf.div){
        let h = '<p><a href="https://docs.gdc.cancer.gov/Data/File_Formats/MAF_Format/" target="_blank">maf</a> at <a href="https://www.github.com/episphere/maf" target="_blank"> Episphere loaded</a>,'
        h += ' <span id="mafInfo">information on how to use it can be found <a href="https://github.com/episphere/maf/wiki" target="_blank">here</a>.</span></p>'
        maf.div.innerHTML=h
        location.hash.match(/[#&](maf=[^&]+)/)
    }

}

maf.txt2json=txt=>{
    // counting for now, more later
    let maf={head:{},body:{}}
    let lines = txt.split('\n')
    let headLines = lines.filter(L=>L[0]=='#')
    let bodyLines = lines.filter(L=>L[0]!='#')
    headLines.forEach(L=>{
        console.log(L)
        let LL = L.slice(1).split('\n')
        maf.head[LL[0]]=LL[1].split(',')
    })
    //dataDiv.textContent=c.splice(0,100)
    return maf
}



window.onload=maf