'use client';
import React from 'react';
export type InviteData={bride:string;groom:string;date:string;time:string;venue:string;bridePhoto:string;groomPhoto:string;card:string};
export default function InvitationPreview({data}:{data:InviteData}){
 return <div className="previewWrap"><div className="phone"><div className="scene"><div className="orn"/><div className="content"><div className="small">TOGETHER WITH THEIR FAMILIES</div>{data.groomPhoto&&<img className="photo" src={data.groomPhoto} alt="Groom"/>}<div className="names">{data.groom||'Groom'}<div className="amp">&amp;</div>{data.bride||'Bride'}</div>{data.bridePhoto&&<img className="photo" src={data.bridePhoto} alt="Bride"/>}<div className="date">{data.date||'SAVE THE DATE'}<br/>{data.time||''}<br/>{data.venue||'Wedding Venue'}</div></div><div className="footer">DESIGNED BY YUVI STUDIO</div></div></div></div>
}
