import sys
sys.path.insert(0, '/home/brain/pycortex')
import cortex
import cortex.dataset as dts

pc = 'PC2'
ss = [1,2,3,4,5,7]
#ss = [5]
for s in ss:
    subject = 'PRJ1210_SUBJ00' + str(s)
    my_min = 100
    my_max = 1500
    cm='jet'

    ds = dts.Dataset()
    sid = 'S' + str(s)
    if s==7:
        sid = 'S6'    
        
    print sid
    dv1 = cortex.Volume('/home/brain/pycortex/IDOR/images/FUNC_REF/refS' +str(s) + 'Heschl.nii.gz', subject, 'fullhead', description='CORR',  cvthr=0.01, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear")
    ds.append(REF1=dv1)
    
    #dv1 = cortex.Volume('/home/brain/pycortex/filestore/db/' + subject + '/transforms/fullhead/reference.nii.gz', subject, 'fullhead', description='CORR',  cvthr=0.01, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear")
    #ds.append(REF2=dv1)

    import cortex.webgl.view_adapted

    cortex.webgl.view_adapted.make_static('qualitycheck_Heschl_SPM_S' + str(s) + '_html' , ds)

