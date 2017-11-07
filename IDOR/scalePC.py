from subprocess import Popen, PIPE

ss = ['S1','S2','S3','S4','S5','S7']
#fs = ['_PC1','_PC2']
fs = ['_PC3','_PC4']

for s in ss:
    fdir  = 'images/RESULTS/'  + s
    fcorr = fdir + '/train_corr.nii.gz'
    p = Popen(["fsl5.0-fslstats", fcorr, "-R"], stdout=PIPE)
    output = p.communicate()[0]
    maxval = float(output.split()[1])
    print maxval
    for f in fs:
        filename = fdir + '/' + 'W_mean' + f + 'best300voxels_Applied2All.nii.gz'
        print(filename)

        p = Popen(["fsl5.0-fslstats", filename, "-R"])

        fout     = fdir + '/' + 'sW_mean' + f + 'best300voxels_Applied2All.nii.gz'
        print(fout)
        p = Popen(["fsl5.0-fslmaths", fcorr, "-mul", filename, fout])

        fout     = fdir + '/' + 's1W_mean' + f + 'best300voxels_Applied2All.nii.gz'
        print(fout)        
        p = Popen(["fsl5.0-fslmaths", fcorr, "-mul", str(1/maxval),"-mul",filename, fout])
    
    

