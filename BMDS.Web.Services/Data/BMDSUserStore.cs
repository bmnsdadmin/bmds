using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BMDS.Web.Services.Data
{
    public class BMDSUserStore: UserStore<IdentityUser>
    {
        public BMDSUserStore():base(new BMDSDataContext())
        {

        }
    }
}