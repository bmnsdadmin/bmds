using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BMDS.Web.Services.Data
{
    public class BMDSUserManager : UserManager<IdentityUser>
    {
        public BMDSUserManager() : base(new BMDSUserStore())
        {
        }
    }
}